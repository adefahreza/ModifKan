'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { query } from '../db.js';
import { requireRole } from '../auth.js';
import { validateUserEdit, hasErrors } from '../validators.js';
import { deleteImage } from '../upload.js';

const field = (formData, name) => {
  const v = formData.get(name);
  return typeof v === 'string' ? v : '';
};

export async function updateUserAction(userId, prevState, formData) {
  await requireRole('admin');
  const { values, errors } = validateUserEdit({
    name: field(formData, 'name'),
    email: field(formData, 'email'),
    phone: field(formData, 'phone'),
  });
  if (hasErrors(errors)) return { errors, values };

  let rowCount;
  try {
    ({ rowCount } = await query('users/update', [Number(userId), values.name, values.email, values.phone]));
  } catch (err) {
    if (err.code === '23505') return { errors: { email: 'Email sudah terdaftar' }, values };
    throw err;
  }
  if (rowCount === 0) return { errors: {}, values, message: 'Pengguna tidak ditemukan' };
  revalidatePath('/admin/users');
  redirect('/admin/users?toast=pengguna-disimpan');
}

export async function deleteUserAction(userId) {
  const admin = await requireRole('admin');
  const id = Number(userId);
  if (!Number.isInteger(id)) return { message: 'Pengguna tidak dapat dihapus' };
  const { rows: files } = await query('users/list-image-files', [id]);
  const { rowCount } = await query('users/delete', [id, admin.id]);
  if (rowCount === 0) return { message: 'Pengguna tidak dapat dihapus' };
  await Promise.all(files.map((f) => deleteImage(f.image)));
  revalidatePath('/admin', 'layout');
  return {};
}
