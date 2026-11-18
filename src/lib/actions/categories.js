'use server';

import { revalidatePath } from 'next/cache';
import { query } from '../db.js';
import { requireRole } from '../auth.js';
import { validateCategory, hasErrors } from '../validators.js';

const field = (formData, name) => {
  const v = formData.get(name);
  return typeof v === 'string' ? v : '';
};

export async function createCategoryAction(prevState, formData) {
  await requireRole('admin');
  const { values, errors } = validateCategory({ name: field(formData, 'name') });
  if (hasErrors(errors)) return { errors, values };
  try {
    await query('categories/create', [values.name]);
  } catch (err) {
    if (err.code === '23505') return { errors: { name: 'Nama kategori sudah ada' }, values };
    throw err;
  }
  revalidatePath('/admin/categories');
  return { errors: {}, values: { name: '' }, saved: Date.now() };
}

export async function updateCategoryAction(id, prevState, formData) {
  await requireRole('admin');
  const { values, errors } = validateCategory({ name: field(formData, 'name') });
  if (hasErrors(errors)) return { errors, values };
  let rowCount;
  try {
    ({ rowCount } = await query('categories/update', [Number(id), values.name]));
  } catch (err) {
    if (err.code === '23505') return { errors: { name: 'Nama kategori sudah ada' }, values };
    throw err;
  }
  if (rowCount === 0) return { errors: {}, values, message: 'Kategori tidak ditemukan' };
  revalidatePath('/admin/categories');
  return { errors: {}, values, saved: Date.now() };
}

export async function deleteCategoryAction(id) {
  await requireRole('admin');
  try {
    const { rowCount } = await query('categories/delete', [Number(id)]);
    if (rowCount === 0) return { message: 'Kategori tidak ditemukan' };
  } catch (err) {
    if (['23001', '23503'].includes(err.code)) return { message: 'Kategori masih dipakai produk, tidak bisa dihapus' };
    throw err;
  }
  revalidatePath('/admin/categories');
  return {};
}
