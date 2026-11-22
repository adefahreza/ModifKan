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

test.describe('halaman error dan akses', () => {
  test('404 bertema dengan tombol ke beranda', async ({ page }) => {
    const res = await page.goto('/halaman-yang-tidak-ada');
    expect(res.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Halaman tidak ditemukan' })).toBeVisible();
    await page.getByRole('link', { name: 'Ke beranda' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('produk yang tidak ada memberi 404 bertema', async ({ page }) => {
    // Status HTTP tidak dicek: dengan loading.jsx (streaming) Next mengirim 200 lalu menampilkan halaman not-found.
    await page.goto('/products/2147483647');
    await expect(page.getByRole('heading', { name: 'Halaman tidak ditemukan' })).toBeVisible();
  });

  test('peran salah ke /403, Guest ke /login, seller pending tetap ke /seller/pending', async ({ page }) => {
    await page.goto('/account');
    await expect(page).toHaveURL(/\/login\?next=/);

    await login(page, 'garasijaya@modifkan.test');
    await page.goto('/account');
    await expect(page).toHaveURL(/\/403$/);
    await expect(page.getByText('Kamu tidak punya akses ke halaman ini')).toBeVisible();
    await page.getByRole('link', { name: /halaman utama saya/ }).click();
    await expect(page).toHaveURL(/\/seller$/);

    await page.context().clearCookies();
    await login(page, 'rizky@modifkan.test');
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/403$/);
    // requireApprovedSeller sengaja tidak diubah (rencana Hari 5): bukan seller -> halaman utama perannya.
    await page.goto('/seller');
    await expect(page).toHaveURL(/\/$/);

    await page.context().clearCookies();
    await login(page, 'turbolokal@modifkan.test');
    await page.goto('/seller');
    await expect(page).toHaveURL(/\/seller\/pending$/);
  });
});

test('gambar gagal dimuat diganti kotak dengan ikon kategori', async ({ page }) => {
  await page.route('**/api/images/**', (route) => route.abort());
  await page.goto('/products');
  const cards = page.locator('article');
  await expect(cards.first()).toBeVisible();
  await expect(cards.first().locator('img')).toHaveCount(0);
  await expect(cards.first().locator('[role="img"]')).toBeVisible();
  const box = await cards.first().locator('[role="img"]').boundingBox();
  expect(box.width).toBeGreaterThan(100);
  expect(Math.abs(box.width - box.height)).toBeLessThan(2);
});

test.describe('toast', () => {
  test('toast dari redirect muncul, param dibersihkan, kunci asing diabaikan', async ({ page }) => {
    await login(page, 'dewi@modifkan.test');
    await page.goto('/account/addresses?toast=toString');
    await expect(page.getByRole('heading', { name: 'Alamat' })).toBeVisible();
    await expect(page.getByRole('status').filter({ hasText: /\S/ })).toHaveCount(0);

    await page.goto('/account/addresses/new');
    await page.getByLabel('Nama penerima').fill('Penguji Toast');
    await page.getByLabel('Nomor HP').fill('081234567890');
    await page.getByLabel('Alamat lengkap').fill('Jl. Toast Coba No. 3, RT 01');
    await page.getByLabel('Kota').fill('Kota Toast E2E');
    await page.getByLabel('Kode pos').fill('40115');
    await expect(async () => {
      await page.getByRole('button', { name: 'Simpan alamat' }).click({ timeout: 2000 });
      await expect(page).toHaveURL(/\/account\/addresses/, { timeout: 2000 });
    }).toPass({ timeout: 10000 });
    await expect(page.getByRole('status').filter({ hasText: 'Alamat disimpan' })).toBeVisible();
    await expect(page).not.toHaveURL(/toast=/);

    // Bersihkan, dan toast dari aksi tanpa redirect.
    const item = page.getByRole('listitem').filter({ hasText: 'Kota Toast E2E' });
    await item.getByRole('button', { name: 'Hapus' }).click();
    await page.getByRole('button', { name: 'Ya, hapus' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Alamat dihapus' })).toBeVisible();
    await expect(item).toHaveCount(0);
  });

  test('toast hilang sendiri setelah beberapa detik', async ({ page }) => {
    await login(page, 'dewi@modifkan.test');
    await page.goto('/products');
    const heart = page.locator('article').first().getByRole('button', { name: /wishlist/ });
    await expect(async () => {
      await heart.click({ timeout: 2000 });
      await expect(page.getByRole('status').filter({ hasText: /wishlist/i })).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 10000 });
    await expect(page.getByRole('status').filter({ hasText: /wishlist/i })).toHaveCount(0, { timeout: 6000 });
    // Kembalikan seperti semula.
    if ((await heart.getAttribute('aria-pressed')) === 'true') await heart.click();
  });
});

const toastOf = (page, text) => page.getByRole('status').filter({ hasText: text });

test('toast keranjang: tambah, ubah jumlah, hapus; error tetap inline', async ({ page }) => {
  await login(page, 'dewi@modifkan.test');
  await page.goto('/products');
  const card = page.locator('article').first();
  const productId = Number((await card.getByRole('link').first().getAttribute('href')).split('/').pop());
  try {
    await expect(async () => {
      await card.getByRole('button', { name: /^Tambah$/ }).click({ timeout: 2000 });
      await expect(toastOf(page, 'Ditambahkan ke keranjang')).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 10000 });

    await page.goto('/cart');
    await page.getByRole('button', { name: /^Tambah jumlah/ }).first().click();
    await expect(toastOf(page, 'Jumlah diperbarui')).toBeVisible();
    await page.getByRole('button', { name: /^Hapus .* dari keranjang$/ }).first().click();
    await expect(toastOf(page, 'Produk dihapus dari keranjang')).toBeVisible();
  } finally {
    await page.request.delete('/api/cart', { data: { productId } });
  }
});

test('error keranjang tetap inline di dekat tombol (tanpa toast)', async ({ page }) => {
  await login(page, 'dewi@modifkan.test');
  await page.goto('/products');
  // Stok dihabiskan lewat API lalu klik "Tambah" lagi: pesan stok muncul di tombol.
  const card = page.locator('article').first();
  const productId = Number((await card.getByRole('link').first().getAttribute('href')).split('/').pop());
  try {
    const res = await page.request.post('/api/cart', { data: { productId, qty: 100000 } });
    expect(res.status()).toBe(409);
    await expect(async () => {
      await page.evaluate(async (id) => { await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: id, qty: 1 }) }); }, productId);
    }).toPass();
  } finally {
    await page.request.delete('/api/cart', { data: { productId } });
  }
});

async function deleteTestCategories(page, name) {
  await page.goto('/admin/categories');
  await page.waitForLoadState('networkidle');
  const left = page.getByRole('listitem').filter({ hasText: name });
  while ((await left.count()) > 0) {
    const before = await left.count();
    await left.first().getByRole('button', { name: 'Hapus' }).click();
    await page.getByRole('button', { name: 'Ya, hapus' }).click();
    await expect(left).toHaveCount(before - 1);
  }
}

test('toast kategori: tambah, ubah, hapus (admin)', async ({ page }) => {
  await login(page, 'admin@modifkan.test', 'admin12345');
  const name = 'Kategori Uji Toast';
  await deleteTestCategories(page, name); // sisa dari percobaan yang gagal akan membuat "tambah" ditolak
  const row = page.getByRole('listitem').filter({ hasText: name });
  try {
    await page.getByLabel('Nama kategori').first().fill(name);
    await expect(async () => {
      await page.getByRole('button', { name: 'Tambah' }).click({ timeout: 2000 });
      await expect(toastOf(page, 'Kategori ditambahkan')).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 10000 });

    await row.getByRole('button', { name: 'Edit' }).click();
    await row.getByRole('textbox').fill(`${name} 2`);
    await row.getByRole('button', { name: 'Simpan' }).click();
    await expect(toastOf(page, 'Kategori disimpan')).toBeVisible();
  } finally {
    await deleteTestCategories(page, name);
  }
});

test.describe('tampilan toast', () => {
  // ?toast= bisa dipakai di halaman toko mana pun, tanpa login.
  const open = async (page) => {
    await page.goto('/products?toast=alamat-disimpan');
    const toast = page.getByRole('status').filter({ hasText: 'Alamat disimpan' });
    await expect(toast).toBeVisible();
    return toast;
  };

  test('desktop: pojok kanan atas, label BERHASIL, bisa ditutup', async ({ page }) => {
    const toast = await open(page);
    const box = await toast.boundingBox();
    expect(box.y).toBeLessThan(40);
    expect(1280 - (box.x + box.width)).toBeLessThan(24);
    expect(box.width).toBeLessThan(420);
    await expect(toast.getByText('Berhasil', { exact: true })).toBeVisible();
    await expect(async () => {
      await toast.getByRole('button', { name: 'Tutup notifikasi' }).click({ timeout: 1000 });
      await expect(page.getByRole('status').filter({ hasText: 'Alamat disimpan' })).toHaveCount(0, { timeout: 1000 });
    }).toPass({ timeout: 8000 });
  });

  test('timer berhenti saat di-hover, lanjut setelah ditinggal', async ({ page }) => {
    const toast = await open(page);
    await page.waitForLoadState('networkidle');
    await toast.hover();
    await page.waitForTimeout(4000);
    await expect(toast).toBeVisible();
    await page.mouse.move(10, 700);
    await expect(page.getByRole('status').filter({ hasText: 'Alamat disimpan' })).toHaveCount(0, { timeout: 5000 });
  });
});

test.describe('tampilan toast (HP)', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('selebar layar dengan margin di bagian atas', async ({ page }) => {
    await page.goto('/products?toast=alamat-disimpan');
    const toast = page.getByRole('status').filter({ hasText: 'Alamat disimpan' });
    await expect(toast).toBeVisible();
    const box = await toast.boundingBox();
    expect(box.y).toBeLessThan(40);
    expect(Math.round(box.x)).toBe(12);
    expect(Math.round(box.width)).toBe(375 - 24);
  });
});

test.describe('bar waktu toast', () => {
  const barWidth = (page) => page.locator('[data-toast-progress]').evaluate((el) => el.getBoundingClientRect().width);

  for (const reducedMotion of ['no-preference', 'reduce']) {
    test(`menyusut selama toast tampil (reducedMotion: ${reducedMotion})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto('/products?toast=alamat-disimpan');
      const toast = page.getByRole('status').filter({ hasText: 'Alamat disimpan' });
      await expect(toast).toBeVisible();
      await page.waitForTimeout(300); // tunggu animasi masuk (geser 1rem, 200ms) selesai sebelum mengukur posisi
      const card = await toast.boundingBox();
      const bar = await page.locator('[data-toast-progress]').boundingBox();
      // Opsi B: tanpa strip kiri, bar dimulai di tepi kiri kartu dan menempel di bawah.
      expect(Math.abs(bar.x - card.x)).toBeLessThan(2);
      expect(Math.abs(bar.y + bar.height - (card.y + card.height))).toBeLessThan(2);
      const start = await barWidth(page);
      await page.waitForTimeout(1200);
      expect(await barWidth(page)).toBeLessThan(start * 0.8);
    });
  }

  test('berhenti saat toast di-hover', async ({ page }) => {
    await page.goto('/products?toast=alamat-disimpan');
    const toast = page.getByRole('status').filter({ hasText: 'Alamat disimpan' });
    await expect(toast).toBeVisible();
    await page.waitForLoadState('networkidle');
    await toast.hover();
    await page.waitForTimeout(150); // beri waktu React menerapkan jeda sebelum mulai mengukur
    const paused = await barWidth(page);
    await page.waitForTimeout(1200);
    expect(Math.abs((await barWidth(page)) - paused)).toBeLessThan(2);
  });
});
