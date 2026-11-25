'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { query } from '../db.js';
import { requireRole, requireApprovedSeller } from '../auth.js';
import { validateStore, validateReason, hasErrors } from '../validators.js';
import { saveImage, deleteImage } from '../upload.js';

// Transisi status toko; 0 baris berarti status asal sudah berubah (dijaga di SQL).
async function transition(queryName, storeId, extra = []) {
  const id = Number(storeId);
  if (!Number.isInteger(id)) return { message: 'Status seller sudah berubah' };
  const { rowCount } = await query(queryName, [id, ...extra]);
  if (rowCount === 0) return { message: 'Status seller sudah berubah' };
  revalidatePath('/admin', 'layout');
  return {};
}

export async function approveSellerAction(storeId) {
  await requireRole('admin');
  return transition('stores/approve', storeId);
}

export async function rejectSellerAction(storeId, reason) {
  await requireRole('admin');
  const { values, errors } = validateReason({ reason });
  if (hasErrors(errors)) return { errors };
  return transition('stores/reject', storeId, [values.reason]);
}

export async function suspendSellerAction(storeId, reason) {
  await requireRole('admin');
  const { values, errors } = validateReason({ reason });
  if (hasErrors(errors)) return { errors };
  return transition('stores/suspend', storeId, [values.reason]);
}

export async function reactivateSellerAction(storeId) {
  await requireRole('admin');
  return transition('stores/reactivate', storeId);
}

export async function updateStoreAction(prevState, formData) {
  const user = await requireApprovedSeller();
  const image = formData.get('image');
  const { values, errors } = validateStore({
    name: String(formData.get('name') ?? ''),
    description: String(formData.get('description') ?? ''),
    image: image && typeof image === 'object' ? image : null,
  });
  const formValues = { name: values.name, description: values.description ?? '' };
  if (hasErrors(errors)) return { errors, values: formValues };

  const { rows: current } = await query('stores/find-by-id', [user.storeId]);
  const hasNew = image && typeof image === 'object' && image.size > 0;
  const newName = hasNew ? await saveImage(image) : null;
  const { rowCount } = await query('stores/update', [user.storeId, values.name, values.description, newName]);
  if (rowCount === 0) {
    if (newName) await deleteImage(newName);
    return { errors: {}, values: formValues, message: 'Toko tidak ditemukan' };
  }
  if (newName && current[0]?.image) await deleteImage(current[0].image);
  revalidatePath('/seller', 'layout');
  redirect('/seller/store?toast=toko-disimpan');
}
