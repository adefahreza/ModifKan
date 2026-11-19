'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { query, withTransaction } from '../db.js';
import { requireRole } from '../auth.js';
import { planCheckout } from '../cart-rules.js';
import { resolveTransition } from '../order-rules.js';

class CheckoutError extends Error {}

// formData diterima agar Hari 5 bisa membaca address_id tanpa mengubah tanda tangan action.
export async function checkoutAction(prevState, formData) {
  const user = await requireRole('buyer');

  let created;
  try {
    created = await withTransaction(async (tx) => {
      const { rows: [{ count }] } = await tx.query('cart/count-rows', [user.id]);
      const { rows } = await tx.query('orders/lock-cart-products', [user.id]);
      const plan = planCheckout(rows, count);
      if (plan.error) throw new CheckoutError(plan.error);

      for (const order of plan.orders) {
        for (const item of order.items) {
          const dec = await tx.query('orders/decrease-stock', [item.productId, item.qty]);
          if (dec.rowCount === 0) throw new CheckoutError(`Stok ${item.name} tidak mencukupi`);
        }
        const { rows: [{ id }] } = await tx.query('orders/create', [user.id, order.storeId, order.total, null, null, null, null, null]);
        for (const item of order.items) {
          await tx.query('orders/create-item', [id, item.productId, item.name, item.price, item.qty]);
        }
      }
      await tx.query('cart/clear', [user.id]);
      return plan.orders.length;
    });
  } catch (err) {
    if (err instanceof CheckoutError) return { message: err.message };
    throw err;
  }

  revalidatePath('/', 'layout');
  redirect(`/account/orders?created=${created}`);
}

// Penjaga sebenarnya ada di SQL: WHERE id, pemilik, dan status asal. Tanpa baris = status sudah berubah.
async function runTransition(sqlName, orderId, ownerId, action, actor) {
  const t = resolveTransition(action, actor);
  const id = Number(orderId);
  if (!t || !Number.isInteger(id) || id < 1 || id > 2147483647) return { message: 'Aksi tidak valid' };

  const params = [id, ownerId, t.to, t.from];
  const changed = t.to === 'dibatalkan'
    ? await withTransaction(async (tx) => {
        const { rowCount } = await tx.query(sqlName, params);
        if (rowCount > 0) await tx.query('orders/restore-stock', [id]);
        return rowCount > 0;
      })
    : (await query(sqlName, params)).rowCount > 0;

  if (!changed) return { message: 'Status pesanan sudah berubah' };
  revalidatePath('/account/orders', 'layout');
  revalidatePath('/seller', 'layout');
  revalidatePath('/admin/orders', 'layout');
  return {};
}

export async function buyerOrderAction(orderId, action) {
  const user = await requireRole('buyer');
  return runTransition('orders/transition-buyer', orderId, user.id, action, 'buyer');
}
