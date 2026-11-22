import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });
// Test berbagi akun dan data alamat, jadi dijalankan berurutan.
test.describe.configure({ mode: 'serial' });

async function login(page, email) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle'); // tunggu hidrasi supaya submit tidak jalan sebelum handler siap
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('modifkan123');
  await page.getByRole('button', { name: 'Masuk' }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

// Submit baru berfungsi setelah hidrasi (handler onSubmit), jadi ulangi sampai berpindah halaman.
async function submitUntil(page, button, urlPattern) {
  await expect(async () => {
    await button.click({ timeout: 2000 });
    await expect(page).toHaveURL(urlPattern, { timeout: 2000 });
  }).toPass({ timeout: 10000 });
}

async function fillAddress(page, a) {
  await page.getByLabel('Nama penerima').fill(a.recipient);
  await page.getByLabel('Nomor HP').fill(a.phone);
  await page.getByLabel('Alamat lengkap').fill(a.address);
  await page.getByLabel('Kota').fill(a.city);
  await page.getByLabel('Kode pos').fill(a.postalCode);
}

const ADDR = { recipient: 'Penguji E2E', phone: '0812-3456-7890', address: 'Jl. Uji Coba No. 7, RT 01 RW 02', city: 'Kota Uji E2E', postalCode: '40115' };

async function deleteAllE2EAddresses(page) {
  await page.goto('/account/addresses');
  const items = page.getByRole('listitem').filter({ hasText: 'Kota Uji E2E' });
  while ((await items.count()) > 0) {
    const before = await items.count();
    await items.first().getByRole('button', { name: 'Hapus' }).click();
    await page.getByRole('button', { name: 'Ya, hapus' }).click();
    await expect(items).toHaveCount(before - 1);
  }
}

test('CRUD alamat: validasi, tambah, ubah, hapus', async ({ page }) => {
  await login(page, 'rizky@modifkan.test');
  try {
    await page.goto('/account/addresses/new');
    await expect(async () => {
      await page.getByRole('button', { name: 'Simpan alamat' }).click({ timeout: 2000 });
      await expect(page.getByText('Nama penerima wajib diisi')).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 10000 });
    await expect(page.getByText('Kode pos harus 5 digit')).toBeVisible();

    await fillAddress(page, ADDR);
    await submitUntil(page, page.getByRole('button', { name: 'Simpan alamat' }), /\/account\/addresses(\?|$)/);
    await expect(page.getByText('Kota Uji E2E')).toBeVisible();

    await page.getByRole('listitem').filter({ hasText: 'Kota Uji E2E' }).getByRole('link', { name: 'Edit' }).click();
    await page.getByLabel('Nama penerima').fill('Penguji Baru');
    await submitUntil(page, page.getByRole('button', { name: 'Simpan alamat' }), /\/account\/addresses(\?|$)/);
    await expect(page.getByText('Penguji Baru')).toBeVisible();

    await deleteAllE2EAddresses(page);
    await expect(page.getByText('Kota Uji E2E')).toHaveCount(0);
  } finally {
    await deleteAllE2EAddresses(page);
  }
});

test('alamat milik buyer lain tidak bisa dibuka (404)', async ({ page }) => {
  await login(page, 'rizky@modifkan.test');
  await page.goto('/account/addresses/new');
  await fillAddress(page, ADDR);
  await submitUntil(page, page.getByRole('button', { name: 'Simpan alamat' }), /\/account\/addresses(\?|$)/);
  const href = await page.getByRole('listitem').filter({ hasText: 'Kota Uji E2E' }).getByRole('link', { name: 'Edit' }).getAttribute('href');
  try {
    await page.context().clearCookies();
    await login(page, 'dewi@modifkan.test');
    const res = await page.goto(href);
    expect(res.status()).toBe(404);
  } finally {
    await page.context().clearCookies();
    await login(page, 'rizky@modifkan.test');
    await deleteAllE2EAddresses(page);
  }
});

test('checkout: tanpa alamat, alamat dirusak, lalu pesanan berhasil membawa alamat', async ({ page }) => {
  await login(page, 'bagas@modifkan.test');
  await page.goto('/products');
  const href = await page.locator('article').first().getByRole('link').first().getAttribute('href');
  const productId = Number(href.split('/').pop());
  await deleteAllE2EAddresses(page);
  try {
    expect((await page.request.post('/api/cart', { data: { productId, qty: 1 } })).ok()).toBeTruthy();

    // Belum punya alamat: tautan tambah alamat, tombol nonaktif.
    await page.goto('/checkout');
    await expect(page.getByText('Belum ada alamat pengiriman')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Buat Pesanan' })).toBeDisabled();

    // Tambah alamat dari checkout, kembali ke /checkout.
    await page.getByRole('link', { name: 'Tambah alamat' }).first().click();
    await fillAddress(page, ADDR);
    await submitUntil(page, page.getByRole('button', { name: 'Simpan alamat' }), /\/checkout$/);
    await expect(page.getByRole('status').filter({ hasText: 'Alamat disimpan' })).toBeVisible();
    await expect(page.getByRole('radio').first()).toBeChecked();
    await expect(page.getByRole('button', { name: 'Buat Pesanan' })).toBeEnabled();

    // address_id diubah ke id yang tidak ada: ditolak, tidak ada order.
    const formAlert = page.locator('form p[role="alert"]');
    await page.getByRole('radio').first().evaluate((el) => { el.value = '99999999'; });
    await expect(async () => {
      await page.getByRole('button', { name: 'Buat Pesanan' }).click({ timeout: 2000 });
      await expect(formAlert).toHaveText('Alamat tidak ditemukan', { timeout: 2000 });
    }).toPass({ timeout: 10000 });

    // Tanpa address_id sama sekali.
    await page.getByRole('radio').first().evaluate((el) => el.remove());
    await page.getByRole('button', { name: 'Buat Pesanan' }).click();
    await expect(formAlert).toHaveText('Pilih alamat pengiriman');
    await expect(page).toHaveURL(/\/checkout$/);

    // Alamat sah: pesanan terbentuk dan alamat tampil di detail.
    await page.reload();
    await submitUntil(page, page.getByRole('button', { name: 'Buat Pesanan' }), /\/account\/orders/);
    await page.locator('a[href^="/account/orders/"]').first().click();
    await expect(page.getByText('Jl. Uji Coba No. 7, RT 01 RW 02, Kota Uji E2E 40115')).toBeVisible();

    // Bersihkan: batalkan pesanan (stok kembali).
    await page.getByRole('button', { name: 'Batalkan' }).click();
    await page.getByRole('button', { name: 'Ya, batalkan' }).click();
    await expect(page.getByText('Dibatalkan').first()).toBeVisible();
  } finally {
    await page.request.delete('/api/cart', { data: { productId } });
    await deleteAllE2EAddresses(page);
  }
});
