'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { query, withTransaction } from '../db.js';
import { SESSION_COOKIE, hashPassword, requireRole, requireApprovedSeller, verifyPassword } from '../auth.js';
import { validateAvatar, validatePasswordChange, validateUserEdit, imageContentError, hasErrors } from '../validators.js';
import { saveImage, deleteImage } from '../upload.js';

const field = (formData, name) => {
  const v = formData.get(name);
  return typeof v === 'string' ? v : '';
};

// Dipakai buyer (users/update) dan admin (users/update-own); peran dicek di action pemanggil.
async function saveProfile(user, formData, queryName) {
  const { values, errors } = validateUserEdit({
    name: field(formData, 'name'),
    email: field(formData, 'email'),
    phone: field(formData, 'phone'),
  });
  if (hasErrors(errors)) return { errors, values };

  try {
    await query(queryName, [user.id, values.name, values.email, values.phone]);
  } catch (err) {
    if (err.code === '23505') return { errors: { email: 'Email sudah terdaftar' }, values };
    throw err;
  }
  revalidatePath('/', 'layout');
  return { errors: {}, values, message: 'Profil disimpan', savedAt: Date.now() };
}

export async function updateProfileAction(prevState, formData) {
  const user = await requireRole('buyer');
  return saveProfile(user, formData, 'users/update');
}

export async function updateAdminProfileAction(prevState, formData) {
  const user = await requireRole('admin');
  return saveProfile(user, formData, 'users/update-own');
}

// Password tidak pernah dikembalikan ke klien lewat values.
async function changePassword(user, formData) {
  const { values, errors } = validatePasswordChange({
    oldPassword: field(formData, 'oldPassword'),
    newPassword: field(formData, 'newPassword'),
    confirmPassword: field(formData, 'confirmPassword'),
  });
  if (hasErrors(errors)) return { errors, values: {} };

  const { rows } = await query('users/find-password-hash', [user.id]);
  if (!rows[0] || !(await verifyPassword(values.oldPassword, rows[0].password_hash))) {
    return { errors: { oldPassword: 'Password lama salah' }, values: {} };
  }
  // Sesi lain (perangkat lain, cookie yang mungkin bocor) dicabut; sesi saat ini tetap login.
  const currentToken = (await cookies()).get(SESSION_COOKIE)?.value ?? '';
  const hash = await hashPassword(values.newPassword);
  await withTransaction(async (tx) => {
    await tx.query('users/update-password', [user.id, hash]);
    await tx.query('auth/delete-other-sessions', [user.id, currentToken]);
  });
  return { errors: {}, values: {}, message: 'Password diperbarui', savedAt: Date.now() };
}

export async function changePasswordAction(prevState, formData) {
  const user = await requireRole('buyer');
  return changePassword(user, formData);
}

export async function changeAdminPasswordAction(prevState, formData) {
  const user = await requireRole('admin');
  return changePassword(user, formData);
}

export async function changeSellerPasswordAction(prevState, formData) {
  const user = await requireApprovedSeller();
  return changePassword(user, formData);
}

// Ganti nama file di database; file lama baru dihapus setelah UPDATE berhasil.
async function replaceAvatar(userId, newName) {
  const { rows } = await query('users/update-avatar', [userId, newName]);
  if (!rows[0]) return false;
  if (rows[0].old_avatar) await deleteImage(rows[0].old_avatar);
  revalidatePath('/', 'layout');
  return true;
}

export async function updateAvatarAction(prevState, formData) {
  const user = await requireRole('buyer');
  const file = formData.get('avatar');
  const errors = validateAvatar(file && typeof file === 'object' ? file : null);
  if (hasErrors(errors)) return { errors };
  const contentError = await imageContentError(file);
  if (contentError) return { errors: { avatar: contentError } };

  const newName = await saveImage(file);
  let saved = false;
  try {
    saved = await replaceAvatar(user.id, newName);
  } finally {
    if (!saved) await deleteImage(newName);
  }
  if (!saved) return { errors: {}, message: 'Foto profil tidak dapat disimpan' };
  return { errors: {}, savedAt: Date.now() };
}

export async function removeAvatarAction() {
  const user = await requireRole('buyer');
  if (!(await replaceAvatar(user.id, null))) return { message: 'Foto profil tidak dapat dihapus' };
  return {};
}
