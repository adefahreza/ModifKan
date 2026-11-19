'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { withTransaction } from '../db.js';
import { requireRole } from '../auth.js';
import { planCheckout } from '../cart-rules.js';

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
