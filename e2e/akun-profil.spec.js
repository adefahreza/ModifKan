import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });
// Akun bagas dipakai bergantian (ubah profil); jalankan berurutan.
test.describe.configure({ mode: 'serial' });

async function login(page, email, password = 'modifkan123') {
  await page.goto('/login');
  await page.waitForLoadState('networkidle'); // tunggu hidrasi supaya submit tidak jalan sebelum handler siap
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Masuk' }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

async function openProfile(page) {
  await login(page, 'bagas@modifkan.test');
  await page.goto('/account');
  await page.waitForLoadState('networkidle');
}

test('tab akun dalam satu kotak, tab aktif mengikuti halaman', async ({ page }) => {
  await openProfile(page);
  const tabs = page.getByRole('navigation', { name: 'Akun' });
  await expect(tabs.getByRole('link', { name: 'Profil' })).toHaveAttribute('aria-current', 'page');
  await tabs.getByRole('link', { name: 'Alamat' }).click();
  await expect(page).toHaveURL(/\/account\/addresses$/);
  await expect(tabs.getByRole('link', { name: 'Alamat' })).toHaveAttribute('aria-current', 'page');
});

test('mode lihat: data tampil sebagai teks, tombol Edit di kanan bawah', async ({ page }) => {
  await openProfile(page);
  await expect(page.getByText('bagas@modifkan.test').last()).toBeVisible();
  await expect(page.getByText(/^\d+ \w+ \d{4}$/)).toBeVisible(); // tanggal bergabung
  await expect(page.getByRole('textbox')).toHaveCount(0); // belum ada kotak isian (kotak cari navbar ber-role searchbox)
  await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
});

test('Edit: baris jadi kotak isian, Batal kembali tanpa menyimpan', async ({ page }) => {
  await openProfile(page);
  await page.getByRole('button', { name: 'Edit' }).click();
  const name = page.getByLabel('Nama');
  await expect(name).toBeFocused();
  await expect(page.getByLabel('Email')).toHaveValue('bagas@modifkan.test');
  await expect(page.getByLabel('Nomor HP')).toBeVisible();
  await name.fill('Nama Sementara');
  await page.getByRole('button', { name: 'Batal' }).click();
  await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
  await expect(page.getByText('Nama Sementara')).toHaveCount(0);
});

test('Edit: error validasi tetap di mode edit, simpan berhasil kembali ke mode lihat', async ({ page }) => {
  await openProfile(page);
  await page.getByRole('button', { name: 'Edit' }).click();
  const original = await page.getByLabel('Nama').inputValue();
  await page.getByLabel('Nama').fill('');
  await page.getByRole('button', { name: 'Simpan' }).click();
  await expect(page.getByText('Nama wajib diisi')).toBeVisible();

  await page.getByLabel('Nama').fill(original);
  await page.getByRole('button', { name: 'Simpan' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Profil disimpan' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
  await expect(page.getByText(original).last()).toBeVisible();
});

test('Ganti Password: form tampil di kolom kanan, salah password lama ditolak, Batal kembali', async ({ page }) => {
  await openProfile(page);
  await page.getByRole('button', { name: 'Ganti Password' }).click();
  await expect(page.getByRole('button', { name: 'Ganti Password' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByLabel('Password lama').fill('salahsekali');
  await page.getByLabel('Password baru', { exact: true }).fill('passwordbaru1');
  await page.getByLabel('Konfirmasi password baru').fill('passwordbaru1');
  await page.getByRole('button', { name: 'Simpan' }).click();
  await expect(page.getByText('Password lama salah')).toBeVisible();
  await page.getByRole('button', { name: 'Batal' }).click();
  await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
});
