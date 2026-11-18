'use server';

import { revalidatePath } from 'next/cache';
import { query } from '../db.js';
import { requireRole } from '../auth.js';

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
