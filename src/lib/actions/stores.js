'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { query } from '../db.js';
import { requireRole, requireApprovedSeller } from '../auth.js';
import { validateStore, hasErrors } from '../validators.js';
import { saveImage, deleteImage } from '../upload.js';

async function setStatus(storeId, status) {
  await requireRole('admin');
  const id = Number(storeId);
  if (!Number.isInteger(id)) return { message: 'Status seller sudah berubah' };
  const { rowCount } = await query('stores/set-status', [id, status]);
  if (rowCount === 0) return { message: 'Status seller sudah berubah' };
  revalidatePath('/admin', 'layout');
  return {};
}

export async function approveSellerAction(storeId) {
  return setStatus(storeId, 'approved');
}

export async function rejectSellerAction(storeId) {
  return setStatus(storeId, 'rejected');
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
