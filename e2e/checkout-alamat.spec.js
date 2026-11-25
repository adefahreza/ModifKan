import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });

const KOTA = 'Kota Pilihan Uji';

async function addAddress(page, recipient, city) {
  await page.goto('/account/addresses/new');
  await page.waitForLoadState('networkidle');
  await page.getByLabel('Nama penerima').fill(recipient);
  await page.getByLabel('Nomor HP').fill('081234567890');
  await page.getByLabel('Alamat lengkap').fill('Jl. Uji Checkout No. 1, RT 01');
  await page.getByLabel('Kota').fill(city);
  await page.getByLabel('Kode pos').fill('40111');
  await page.getByRole('button', { name: 'Simpan alamat' }).click();
  await expect(page).toHaveURL(/\/account\/addresses(\?|$)/);
}

async function addToCart(page) {
  await page.goto('/products/1');
  await page.waitForLoadState('networkidle');
  const [res] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/cart')),
    page.getByRole('button', { name: 'Tambah ke Keranjang' }).click(),
  ]);
  expect(res.ok()).toBe(true);
}

test('checkout gagal tidak mengganti alamat yang dipilih', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.getByLabel('Email').fill('bagas@modifkan.test');
  await page.getByLabel('Password').fill('modifkan123');
  await page.getByRole('button', { name: 'Masuk' }).click();
  await expect(page).not.toHaveURL(/\/login/);

  await addAddress(page, 'Penerima Awal', 'Kota Awal Uji');
  await addAddress(page, 'Penerima Pilihan', KOTA);
  await addToCart(page);

  await page.goto('/checkout');
  await page.waitForLoadState('networkidle');
  const chosen = page.getByRole('radio', { name: new RegExp(KOTA) }).last();
  await chosen.check();

  // Keranjang dikosongkan di tab lain supaya server menolak pesanan.
  const other = await page.context().newPage();
  await other.goto('/cart');
  await other.waitForLoadState('networkidle');
  await other.getByRole('button', { name: /Hapus/ }).first().click();
  const confirmButton = other.getByRole('button', { name: 'Ya, hapus' });
  if (await confirmButton.count()) await confirmButton.click();
  await expect(other.getByText(/Keranjang.*kosong/i).first()).toBeVisible();

  await page.getByRole('button', { name: 'Buat Pesanan' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toBeVisible();
  await expect(chosen, 'alamat pilihan tetap terpilih setelah gagal').toBeChecked();

  await addToCart(other);
  await other.close();
  await page.getByRole('button', { name: 'Buat Pesanan' }).click();
  await expect(page).toHaveURL(/\/account\/orders/);
  // Pesanan terbaru ada di urutan pertama; detailnya harus membawa alamat yang dipilih.
  await page.getByRole('main').getByRole('listitem').first().getByRole('link', { name: 'Lihat detail' }).click();
  await expect(page.getByText(KOTA, { exact: false })).toBeVisible();
});
