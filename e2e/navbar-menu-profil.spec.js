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

async function openHome(page) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

test('navbar tanpa ikon wishlist dan tanpa tombol Keluar terpisah', async ({ page }) => {
  await login(page, 'bagas@modifkan.test');
  await openHome(page);
  const header = page.locator('header');
  await expect(header.getByRole('link', { name: 'Wishlist' })).toHaveCount(0);
  await expect(header.getByRole('button', { name: 'Keluar' })).toHaveCount(0);
  await expect(header.getByRole('link', { name: 'Keranjang' })).toBeVisible();
});

test('menu profil terbuka saat hover dan berisi Akun saya serta Keluar', async ({ page }) => {
  await login(page, 'bagas@modifkan.test');
  await openHome(page);
  const trigger = page.getByRole('button', { name: /Menu akun/ });
  await trigger.hover();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('bagas@modifkan.test')).toBeVisible();
  await page.getByRole('link', { name: 'Akun saya' }).click();
  await expect(page).toHaveURL(/\/account$/);
});

test('menu profil: klik membuka, Esc menutup dan fokus kembali ke tombol', async ({ page }) => {
  await login(page, 'bagas@modifkan.test');
  await openHome(page);
  const trigger = page.getByRole('button', { name: /Menu akun/ });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('link', { name: 'Akun saya' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('link', { name: 'Akun saya' })).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('seller dan admin tidak bisa membuka halaman toko, dialihkan ke dashboard', async ({ page }) => {
  await login(page, 'kakikuat@modifkan.test');
  for (const path of ['/', '/products', '/cart']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/seller$/);
  }
  await page.context().clearCookies();
  await login(page, 'admin@modifkan.test', 'admin12345');
  for (const path of ['/', '/products/1', '/checkout']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/admin$/);
  }
});

test('layar kecil: menu profil tetap bisa dipakai untuk keluar', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await login(page, 'bagas@modifkan.test');
  await openHome(page);
  await page.getByRole('button', { name: /Menu akun/ }).click();
  await page.getByRole('button', { name: 'Keluar' }).click();
  await expect(page).toHaveURL(/\/login$/);
});
