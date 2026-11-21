export const SORTS = ['terbaru', 'harga_terendah', 'harga_tertinggi'];

const first = (v) => (Array.isArray(v) ? v[0] : v);

function toInt(v) {
  const s = first(v);
  return typeof s === 'string' && /^\d{1,9}$/.test(s) ? Number(s) : null;
}

function toRating(v) {
  const s = first(v);
  return typeof s === 'string' && /^[1-5]$/.test(s) ? Number(s) : null;
}

export function parseProductFilters(searchParams = {}) {
  const rawQ = first(searchParams.q);
  const q = typeof rawQ === 'string' ? rawQ.trim().slice(0, 100) || null : null;
  let minPrice = toInt(searchParams.min);
  let maxPrice = toInt(searchParams.max);
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];
  const rawSort = first(searchParams.sort);
  return {
    q,
    categoryId: toInt(searchParams.category),
    minPrice,
    maxPrice,
    minRating: toRating(searchParams.rating),
    sort: SORTS.includes(rawSort) ? rawSort : 'terbaru',
  };
}

export function toQueryString(filters, overrides = {}) {
  const f = { ...filters, ...overrides };
  const sp = new URLSearchParams();
  if (f.q !== null && f.q !== undefined) sp.set('q', f.q);
  if (f.categoryId !== null && f.categoryId !== undefined) sp.set('category', String(f.categoryId));
  if (f.minPrice !== null && f.minPrice !== undefined) sp.set('min', String(f.minPrice));
  if (f.maxPrice !== null && f.maxPrice !== undefined) sp.set('max', String(f.maxPrice));
  if (f.minRating !== null && f.minRating !== undefined) sp.set('rating', String(f.minRating));
  if (f.sort && f.sort !== 'terbaru') sp.set('sort', f.sort);
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}
