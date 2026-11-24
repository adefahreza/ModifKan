import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });

async function login(page, email, password = 'modifkan123') {
  await page.goto('/login');
  await page.waitForLoadState('networkidle'); // tunggu hidrasi supaya submit tidak jalan sebelum handler siap
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Masuk' }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

// Handler klik baru terpasang setelah hidrasi, jadi ulangi sampai request terkirim.
async function toggleHeart(page, button) {
  await expect(async () => {
    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/wishlist'), { timeout: 2000 }),
      button.click({ timeout: 2000 }),
    ]);
    expect(res.ok()).toBeTruthy();
  }).toPass({ timeout: 10000 });
}

async function clearWishlist(page) {
  await page.goto('/account/wishlist');
  while ((await page.getByRole('button', { name: 'Hapus dari wishlist' }).count()) > 0) {
    await toggleHeart(page, page.getByRole('button', { name: 'Hapus dari wishlist' }).first());
    await page.waitForLoadState('networkidle');
  }
}

const cardName = (card) => card.getByRole('link').nth(1).textContent();

test('Guest klik hati diarahkan ke login lalu kembali', async ({ page }) => {
  await page.goto('/products');
  await expect(async () => {
    await page.getByRole('button', { name: 'Simpan ke wishlist' }).first().click({ timeout: 2000 });
    await expect(page).toHaveURL(/\/login\?next=/, { timeout: 2000 });
  }).toPass({ timeout: 10000 });
  await page.getByLabel('Email').fill('rizky@modifkan.test');
  await page.getByLabel('Password').fill('modifkan123');
  await page.getByRole('button', { name: 'Masuk' }).click();
  await expect(page).toHaveURL(/\/products/);
});

test('Buyer simpan dua produk, tampil di wishlist, lalu hapus', async ({ page }) => {
  await login(page, 'rizky@modifkan.test');
  await clearWishlist(page);
  try {
    await page.goto('/products');
    const cards = page.locator('article');
    const names = [await cardName(cards.nth(0)), await cardName(cards.nth(1))];
    for (const i of [0, 1]) {
      await toggleHeart(page, cards.nth(i).getByRole('button', { name: 'Simpan ke wishlist' }));
      await expect(cards.nth(i).getByRole('button', { name: 'Hapus dari wishlist' })).toHaveAttribute('aria-pressed', 'true');
    }

    await page.goto('/account/wishlist');
    for (const n of names) await expect(page.getByRole('link', { name: n, exact: true })).toBeVisible();

    await toggleHeart(page, page.getByRole('button', { name: 'Hapus dari wishlist' }).first());
    await expect(page.getByRole('link', { name: names[0], exact: true }).or(page.getByRole('link', { name: names[1], exact: true }))).toHaveCount(1);
    await clearWishlist(page);
    await expect(page.getByText('Wishlist masih kosong')).toBeVisible();
  } finally {
    await clearWishlist(page);
  }
});

test('Seller tidak bisa membuka katalog dan API wishlist menolak (403)', async ({ page }) => {
  await login(page, 'garasijaya@modifkan.test');
  await page.goto('/products');
  // Halaman toko tertutup untuk Seller: dialihkan ke dashboard, jadi tombol wishlist tidak pernah tampil.
  await expect(page).toHaveURL(/\/seller$/);
  await expect(page.getByRole('button', { name: /wishlist/i })).toHaveCount(0);
  const res = await page.request.post('/api/wishlist', { data: { productId: 1 } });
  expect(res.status()).toBe(403);
});

test('Guest ke API wishlist mendapat 401, data rusak 400', async ({ page, request }) => {
  expect((await request.post('/api/wishlist', { data: { productId: 1 } })).status()).toBe(401);
  await login(page, 'rizky@modifkan.test');
  expect((await page.request.post('/api/wishlist', { data: { productId: 'x' } })).status()).toBe(400);
  expect((await page.request.post('/api/wishlist', { data: { productId: 2147483647 } })).status()).toBe(404);
});
