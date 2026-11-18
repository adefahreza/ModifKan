'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { query } from '../db.js';
import { requireApprovedSeller, requireRole } from '../auth.js';
import { validateProduct, hasErrors } from '../validators.js';
import { saveImage, deleteImage } from '../upload.js';

const text = (formData, name) => {
  const v = formData.get(name);
  return typeof v === 'string' ? v : '';
};

function readProduct(formData) {
  const image = formData.get('image');
  return {
    name: text(formData, 'name'),
    description: text(formData, 'description'),
    price: text(formData, 'price'),
    stock: text(formData, 'stock'),
    categoryId: text(formData, 'categoryId'),
    image: image && typeof image === 'object' ? image : null,
  };
}

const echo = (v) => ({ name: v.name, description: v.description, price: String(v.price), stock: String(v.stock), categoryId: String(v.categoryId) });
const hasFile = (f) => f && typeof f === 'object' && f.size > 0;

export async function createProductAction(prevState, formData) {
  const user = await requireApprovedSeller();
  const input = readProduct(formData);
  const { values, errors } = validateProduct(input, { isEdit: false });
  if (hasErrors(errors)) return { errors, values: echo(values) };

  const imageName = await saveImage(input.image);
  try {
    await query('products/create', [user.storeId, values.categoryId, values.name, values.description, values.price, values.stock, imageName]);
  } catch (err) {
    await deleteImage(imageName);
    if (err.code === '23503') return { errors: { categoryId: 'Kategori tidak ditemukan' }, values: echo(values) };
    throw err;
  }
  revalidatePath('/seller', 'layout');
  redirect('/seller/products');
}

export async function updateProductAction(productId, prevState, formData) {
  const user = await requireApprovedSeller();
  const id = Number(productId);
  const input = readProduct(formData);
  const { values, errors } = validateProduct(input, { isEdit: true });
  if (hasErrors(errors)) return { errors, values: echo(values) };

  const { rows: before } = await query('products/find-by-store', [id, user.storeId]);
  if (!before[0]) return { errors: {}, values: echo(values), message: 'Produk tidak ditemukan' };

  const newName = hasFile(input.image) ? await saveImage(input.image) : null;
  let rowCount;
  try {
    ({ rowCount } = await query('products/update', [id, user.storeId, values.categoryId, values.name, values.description, values.price, values.stock, newName]));
  } catch (err) {
    if (newName) await deleteImage(newName);
    if (err.code === '23503') return { errors: { categoryId: 'Kategori tidak ditemukan' }, values: echo(values) };
    throw err;
  }
  if (rowCount === 0) {
    if (newName) await deleteImage(newName);
    return { errors: {}, values: echo(values), message: 'Produk tidak ditemukan' };
  }
  if (newName) await deleteImage(before[0].image);
  revalidatePath('/seller', 'layout');
  redirect('/seller/products');
}

export async function deleteProductAction(productId) {
  const user = await requireApprovedSeller();
  const { rows } = await query('products/delete-by-store', [Number(productId), user.storeId]);
  if (!rows[0]) return { message: 'Produk tidak ditemukan' };
  await deleteImage(rows[0].image);
  revalidatePath('/seller', 'layout');
  return {};
}

export async function deleteProductAdminAction(productId) {
  await requireRole('admin');
  const { rows } = await query('products/delete-admin', [Number(productId)]);
  if (!rows[0]) return { message: 'Produk tidak ditemukan' };
  await deleteImage(rows[0].image);
  revalidatePath('/admin/products');
  return {};
}
