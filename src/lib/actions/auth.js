'use server';

import { redirect } from 'next/navigation';
import { query, withTransaction } from '../db.js';
import { validateRegister, validateLogin, hasErrors } from '../validators.js';
import { hashPassword, verifyPassword, createSession, destroySession, requireRole } from '../auth.js';
import { homePathFor, safeNext } from '../auth-rules.js';

const field = (formData, name) => {
  const v = formData.get(name);
  return typeof v === 'string' ? v : '';
};

export async function registerAction(prevState, formData) {
  const { values, errors } = validateRegister({
    role: field(formData, 'role'),
    name: field(formData, 'name'),
    email: field(formData, 'email'),
    phone: field(formData, 'phone'),
    password: field(formData, 'password'),
    confirmPassword: field(formData, 'confirmPassword'),
    storeName: field(formData, 'storeName'),
  });
  const { password, confirmPassword, ...safeValues } = values;
  if (hasErrors(errors)) return { errors, values: { ...safeValues, storeName: safeValues.storeName ?? '' } };

  const passwordHash = await hashPassword(password);
  let userId;
  try {
    userId = await withTransaction(async (tx) => {
      const { rows } = await tx.query('auth/create-user', [values.name, values.email, values.phone, passwordHash, values.role]);
      if (values.role === 'seller') await tx.query('auth/create-store', [rows[0].id, values.storeName]);
      return rows[0].id;
    });
  } catch (err) {
    if (err.code === '23505') {
      return { errors: { email: 'Email sudah terdaftar' }, values: { ...safeValues, storeName: safeValues.storeName ?? '' } };
    }
    throw err;
  }

  await createSession(userId);
  redirect(homePathFor({ role: values.role, storeStatus: values.role === 'seller' ? 'pending' : null }));
}

export async function loginAction(prevState, formData) {
  const { values, errors } = validateLogin({ email: field(formData, 'email'), password: field(formData, 'password') });
  if (hasErrors(errors)) return { errors, values: { email: values.email } };

  const { rows } = await query('auth/find-user-by-email', [values.email]);
  const row = rows[0];
  const ok = row ? await verifyPassword(values.password, row.password_hash) : false;
  if (!ok) return { errors: {}, values: { email: values.email }, message: 'Email atau password salah' };

  await createSession(row.id);
  const user = { role: row.role, storeStatus: row.store_status };
  const next = row.role === 'buyer' ? safeNext(field(formData, 'next')) : null;
  redirect(next ?? homePathFor(user));
}

export async function logoutAction() {
  await destroySession();
  redirect('/');
}

export async function deleteRejectedAccountAction() {
  const user = await requireRole('seller');
  const { rowCount } = await query('auth/delete-rejected-seller', [user.id]);
  if (rowCount === 0) return { message: 'Akun tidak dapat dihapus' };
  await destroySession();
  redirect('/?deleted=1');
}
