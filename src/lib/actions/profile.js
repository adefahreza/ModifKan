'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { query, withTransaction } from '../db.js';
import { SESSION_COOKIE, hashPassword, requireRole, verifyPassword } from '../auth.js';
import { validatePasswordChange, validateUserEdit, hasErrors } from '../validators.js';

const field = (formData, name) => {
  const v = formData.get(name);
  return typeof v === 'string' ? v : '';
};

export async function updateProfileAction(prevState, formData) {
  const user = await requireRole('buyer');
  const { values, errors } = validateUserEdit({
    name: field(formData, 'name'),
    email: field(formData, 'email'),
    phone: field(formData, 'phone'),
  });
  if (hasErrors(errors)) return { errors, values };

  try {
    await query('users/update', [user.id, values.name, values.email, values.phone]);
  } catch (err) {
    if (err.code === '23505') return { errors: { email: 'Email sudah terdaftar' }, values };
    throw err;
  }
  revalidatePath('/', 'layout');
  return { errors: {}, values, message: 'Profil disimpan', savedAt: Date.now() };
}

// Password tidak pernah dikembalikan ke klien lewat values.
export async function changePasswordAction(prevState, formData) {
  const user = await requireRole('buyer');
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
