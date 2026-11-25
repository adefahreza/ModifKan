import { test, expect } from '@playwright/test';
import path from 'node:path';

test.use({ viewport: { width: 1280, height: 800 } });
// Test berbagi akun dewi, jadi dijalankan berurutan.
test.describe.configure({ mode: 'serial' });

const FOTO = path.resolve('public/icons/kategori/aksesoris.png');

async function login(page, email, password = 'modifkan123') {
  await page.context().clearCookies();
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Masuk' }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

async function openAccount(page) {
  await page.goto('/account');
  await page.waitForLoadState('networkidle');
}

const card = (page) => page.getByRole('region', { name: 'Foto profil' });
const cardImg = (page) => card(page).locator('img');
const navImg = (page) => page.getByRole('button', { name: /Menu akun/ }).locator('img');
const toast = (page, text) => page.getByRole('status').filter({ hasText: text });

async function upload(page, file = FOTO) {
  await card(page).getByLabel('Pilih foto profil').setInputFiles(file);
  await card(page).getByRole('button', { name: 'Simpan Foto' }).click();
  await expect(card(page).getByRole('button', { name: 'Simpan Foto' })).toHaveCount(0);
  await expect(cardImg(page)).toHaveAttribute('src', /^\/api\/images\//);
}

async function removePhoto(page) {
  const hapus = card(page).getByRole('button', { name: 'Hapus Foto' });
  if (!(await hapus.count())) return;
  await hapus.click();
  await page.getByRole('button', { name: 'Ya, hapus' }).click();
  await expect(hapus).toHaveCount(0);
}

const status = async (page, url) => (await page.request.get(url)).status();

test.beforeEach(async ({ page }) => {
  await login(page, 'dewi@modifkan.test');
  await openAccount(page);
});

test.afterEach(async ({ page }) => {
  await page.unrouteAll({ behavior: 'ignoreErrors' });
  await login(page, 'dewi@modifkan.test');
  await openAccount(page);
  await removePhoto(page);
});

test('unggah, ganti, hapus', async ({ page }) => {
  await expect(card(page).getByText('DL')).toBeVisible();
  await expect(card(page).getByRole('button', { name: 'Hapus Foto' })).toHaveCount(0);

  await upload(page);
  await expect(toast(page, 'Foto profil disimpan')).toBeVisible();
  await expect(cardImg(page)).toHaveAttribute('alt', 'Foto profil Dewi Lestari');
  const first = await cardImg(page).getAttribute('src');
  await expect(navImg(page)).toHaveAttribute('src', first);
  expect(await status(page, first)).toBe(200);

  await upload(page);
  await expect(cardImg(page)).not.toHaveAttribute('src', first);
  const second = await cardImg(page).getAttribute('src');
  expect(await status(page, first), 'file lama terhapus').toBe(404);

  await removePhoto(page);
  await expect(toast(page, 'Foto profil dihapus')).toBeVisible();
  await expect(card(page).getByText('DL')).toBeVisible();
  await expect(cardImg(page)).toHaveCount(0);
  await expect(navImg(page)).toHaveCount(0);
  expect(await status(page, second), 'file terhapus').toBe(404);
});

test('pratinjau lalu Batal tidak menyimpan', async ({ page }) => {
  await card(page).getByLabel('Pilih foto profil').setInputFiles(FOTO);
  await expect(card(page).getByRole('img', { name: 'Pratinjau foto baru' })).toBeVisible();
  await expect(card(page).getByText('Pilih Foto', { exact: true }), 'tombol pilih disembunyikan saat pratinjau').toBeHidden();
  await card(page).getByRole('button', { name: 'Batal' }).click();
  await expect(card(page).getByText('DL')).toBeVisible();
  await openAccount(page);
  await expect(card(page).getByText('DL')).toBeVisible();
});

test('file ditolak', async ({ page }) => {
  const input = card(page).getByLabel('Pilih foto profil');
  await input.setInputFiles({ name: 'besar.png', mimeType: 'image/png', buffer: Buffer.alloc(4 * 1024 * 1024) });
  await expect(card(page).getByText('Ukuran gambar maksimal 2 MB')).toBeVisible();
  await expect(card(page).getByRole('button', { name: 'Simpan Foto' })).toHaveCount(0);

  await input.setInputFiles({ name: 'a.gif', mimeType: 'image/gif', buffer: Buffer.from('GIF89a') });
  await expect(card(page).getByText('Format gambar harus JPG, PNG, atau WEBP')).toBeVisible();
  await expect(card(page).getByRole('button', { name: 'Simpan Foto' })).toHaveCount(0);
});

test('gambar gagal dimuat kembali ke inisial', async ({ page }) => {
  await upload(page);
  await page.route('**/api/images/**', (route) => route.abort());
  await openAccount(page);
  const fallback = card(page).getByRole('img', { name: 'Foto profil Dewi Lestari' });
  await expect(fallback).toContainText('DL');
});

test('admin menghapus buyer berfoto, file ikut terhapus', async ({ page }) => {
  const email = `foto.${Date.now()}@modifkan.test`;
  await page.context().clearCookies();
  await page.goto('/register');
  await page.waitForLoadState('networkidle');
  await page.getByLabel('Nama lengkap').fill('Buyer Berfoto');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Nomor HP').fill('081234567890');
  await page.getByLabel('Password', { exact: true }).fill('modifkan123');
  await page.getByLabel('Konfirmasi password').fill('modifkan123');
  await page.getByRole('button', { name: 'Daftar' }).click();
  await expect(page).not.toHaveURL(/\/register/);
  await openAccount(page);
  await upload(page);
  const url = await cardImg(page).getAttribute('src');

  await login(page, 'admin@modifkan.test', 'admin12345');
  await page.goto(`/admin/users?q=${encodeURIComponent(email)}`);
  await page.waitForLoadState('networkidle');
  await page.getByRole('row').filter({ hasText: email }).getByRole('button', { name: 'Hapus' }).click();
  await page.getByRole('button', { name: 'Ya, hapus' }).click();
  await expect(page.getByRole('row').filter({ hasText: email })).toHaveCount(0);
  expect(await status(page, url)).toBe(404);
});
