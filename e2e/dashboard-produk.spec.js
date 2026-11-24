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

// Buka pesanan pertama, lalu klik nama produk pertama di daftar item.
async function openFirstOrderProduct(page, ordersPath) {
  await page.goto(ordersPath);
  await page.locator('tbody tr').first().locator('a').first().click();
  await expect(page).toHaveURL(new RegExp(`${ordersPath}/\\d+$`));
  await page.locator('main ul').last().getByRole('link').first().click();
}

async function expectDashboardOnly(page, activeMenu) {
  // Tanpa navbar toko (search bar), sidebar dashboard tetap ada dengan menu yang aktif.
  await expect(page.getByRole('searchbox', { name: 'Cari produk' })).toHaveCount(0);
  await expect(page.locator('aside').getByRole('link', { name: activeMenu })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { name: 'Ulasan' })).toBeVisible();
}

test('seller: produk di detail pesanan membuka detail produk di dashboard seller', async ({ page }) => {
  await login(page, 'speedshop@modifkan.test');
  await openFirstOrderProduct(page, '/seller/orders');
  await expect(page).toHaveURL(/\/seller\/products\/\d+$/);
  await expectDashboardOnly(page, 'Produk');
  await expect(page.getByRole('link', { name: 'Edit produk' })).toBeVisible();
});

test('seller: nama produk di menu Produk membuka detail produk', async ({ page }) => {
  await login(page, 'kakikuat@modifkan.test');
  await page.goto('/seller/products');
  const link = page.locator('tbody tr').first().getByRole('link').first();
  const name = (await link.textContent()).trim();
  await link.click();
  await expect(page).toHaveURL(/\/seller\/products\/\d+$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);
  await expectDashboardOnly(page, 'Produk');
});

test('admin: nama produk di Moderasi Produk membuka detail produk', async ({ page }) => {
  await login(page, 'admin@modifkan.test', 'admin12345');
  await page.goto('/admin/products');
  const link = page.locator('tbody tr').first().getByRole('link').first();
  const name = (await link.textContent()).trim();
  await link.click();
  await expect(page).toHaveURL(/\/admin\/products\/\d+$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);
  await expectDashboardOnly(page, 'Moderasi Produk');
});

test('admin: produk di detail pesanan membuka detail produk di dashboard admin', async ({ page }) => {
  await login(page, 'admin@modifkan.test', 'admin12345');
  await openFirstOrderProduct(page, '/admin/orders');
  await expect(page).toHaveURL(/\/admin\/products\/\d+$/);
  await expectDashboardOnly(page, 'Moderasi Produk');
});

test('seller tidak bisa melihat detail produk toko lain', async ({ page }) => {
  // Ambil id produk Garasi Jaya dari katalog publik (sebagai Guest).
  await page.goto('/products');
  const href = await page.locator('article', { hasText: 'Garasi Jaya' }).first().getByRole('link').first().getAttribute('href');
  const id = href.split('/').pop();

  await login(page, 'kakikuat@modifkan.test');
  await page.goto(`/seller/products/${id}`);
  // Next.js streaming bisa mengirim status 200; yang penting isinya halaman "tidak ditemukan", bukan data produk.
  await expect(page.getByRole('heading', { name: 'Halaman tidak ditemukan' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ulasan' })).toHaveCount(0);
});
