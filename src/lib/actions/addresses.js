'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { query } from '../db.js';
import { requireRole } from '../auth.js';
import { safeNext } from '../auth-rules.js';
import { validateAddress, hasErrors } from '../validators.js';

const field = (formData, name) => {
  const v = formData.get(name);
  return typeof v === 'string' ? v : '';
};

function readAddress(formData) {
  return validateAddress({
    recipient: field(formData, 'recipient'),
    phone: field(formData, 'phone'),
    address: field(formData, 'address'),
    city: field(formData, 'city'),
    postalCode: field(formData, 'postalCode'),
  });
}

// Menambahkan ?toast=<kunci> ke path tujuan, aman untuk path yang sudah punya query atau hash.
function withToast(path, key) {
  const url = new URL(path, 'http://localhost');
  url.searchParams.set('toast', key);
  return url.pathname + url.search + url.hash;
}

function validId(id) {
  const n = Number(id);
  return Number.isInteger(n) && n >= 1 && n <= 2147483647 ? n : null;
}

export async function createAddressAction(prevState, formData) {
  const user = await requireRole('buyer');
  const { values, errors } = readAddress(formData);
  if (hasErrors(errors)) return { errors, values };
  await query('addresses/create', [user.id, values.recipient, values.phone, values.address, values.city, values.postalCode]);
  revalidatePath('/account/addresses');
  revalidatePath('/checkout');
  redirect(withToast(safeNext(field(formData, 'next')) ?? '/account/addresses', 'alamat-disimpan'));
}

export async function updateAddressAction(id, prevState, formData) {
  const user = await requireRole('buyer');
  const { values, errors } = readAddress(formData);
  if (hasErrors(errors)) return { errors, values };
  const addressId = validId(id);
  const updated = addressId
    ? await query('addresses/update', [addressId, user.id, values.recipient, values.phone, values.address, values.city, values.postalCode])
    : { rowCount: 0 };
  if (updated.rowCount === 0) return { errors: {}, values, message: 'Alamat tidak ditemukan' };
  revalidatePath('/account/addresses');
  revalidatePath('/checkout');
  redirect('/account/addresses?toast=alamat-disimpan');
}

export async function deleteAddressAction(id) {
  const user = await requireRole('buyer');
  const addressId = validId(id);
  const deleted = addressId ? await query('addresses/delete', [addressId, user.id]) : { rowCount: 0 };
  if (deleted.rowCount === 0) return { message: 'Alamat tidak ditemukan' };
  revalidatePath('/account/addresses');
  revalidatePath('/checkout');
  return {};
}
