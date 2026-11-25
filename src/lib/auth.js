import 'server-only';
import crypto from 'node:crypto';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { query } from './db.js';
import { homePathFor } from './auth-rules.js';

export const SESSION_COOKIE = 'modifkan_session';
const SESSION_DAYS = 7;

export function hashPassword(pw) {
  return bcrypt.hash(pw, 10);
}

export function verifyPassword(pw, hash) {
  return bcrypt.compare(pw, hash);
}

export async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await query('auth/create-session', [token, userId, expiresAt]);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
}

export const getCurrentUser = cache(async () => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const { rows } = await query('auth/find-session-user', [token]);
  const r = rows[0];
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    role: r.role,
    avatar: r.avatar,
    createdAt: r.created_at,
    storeId: r.store_id,
    storeName: r.store_name,
    storeStatus: r.store_status,
    storeCreatedAt: r.store_created_at,
  };
});

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await query('auth/delete-session', [token]);
  store.delete(SESSION_COOKIE);
}

export async function requireRole(...roles) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!roles.includes(user.role)) redirect('/403');
  return user;
}

export async function requireApprovedSeller() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'seller' || user.storeStatus !== 'approved') redirect(homePathFor(user));
  return user;
}

// Untuk route handler JSON: mengembalikan { user } atau { response } (401 untuk Guest, 403 untuk peran lain).
export async function requireRoleApi(...roles) {
  const user = await getCurrentUser();
  if (!user) return { response: Response.json({ error: 'Silakan masuk terlebih dahulu' }, { status: 401 }) };
  if (!roles.includes(user.role)) return { response: Response.json({ error: 'Anda tidak punya akses' }, { status: 403 }) };
  return { user };
}
