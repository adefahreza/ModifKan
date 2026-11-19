'use server';

import { revalidatePath } from 'next/cache';
import { query } from '../db.js';
import { requireRole } from '../auth.js';
import { validateReview, hasErrors } from '../validators.js';

const field = (formData, name) => {
  const v = formData.get(name);
  return typeof v === 'string' ? v : '';
};

export async function createReviewAction(orderItemId, prevState, formData) {
  const user = await requireRole('buyer');
  const { values, errors } = validateReview({ rating: field(formData, 'rating'), comment: field(formData, 'comment') });
  if (hasErrors(errors)) return { errors, values };

  const id = Number(orderItemId);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) return { errors: {}, values, message: 'Item tidak dapat diulas' };

  const { rows } = await query('reviews/create', [id, user.id, values.rating, values.comment]);
  if (!rows[0]) return { errors: {}, values, message: 'Item tidak dapat diulas' };

  revalidatePath('/account/orders', 'layout');
  revalidatePath(`/products/${rows[0].product_id}`);
  return { errors: {}, values: {}, message: 'Ulasan terkirim', done: true };
}
