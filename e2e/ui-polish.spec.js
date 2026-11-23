import { test, expect } from '@playwright/test';

// Di server dev, CSS bisa menyusul setelah event load; tunggu jaringan tenang sebelum mengukur.
async function open(page, url) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
}

test.describe('poles UI katalog', () => {
  test('garis tepi chip tidak terpotong wadah scroll', async ({ page }) => {
    await open(page, '/products');
    const gap = await page.locator('[role=tablist]').first().evaluate((list) => {
      const box = list.getBoundingClientRect();
      const chip = list.firstElementChild.getBoundingClientRect();
      return { top: chip.top - box.top, bottom: box.bottom - chip.bottom };
    });
    // ring-2 saat fokus menonjol 2px; harus muat di dalam wadah
    expect(gap.top).toBeGreaterThanOrEqual(2);
    expect(gap.bottom).toBeGreaterThanOrEqual(2);
  });

  test('panah dropdown Urutkan tidak mepet ke kanan', async ({ page }) => {
    await open(page, '/products');
    const select = page.getByLabel('Urutkan');
    expect(await select.evaluate((el) => getComputedStyle(el).appearance)).toBe('none');
    const arrow = page.locator('[data-select-arrow]');
    await expect(arrow).toBeVisible();
    const s = await select.boundingBox();
    const a = await arrow.boundingBox();
    expect(s.x + s.width - (a.x + a.width)).toBeGreaterThanOrEqual(10);
  });

  for (const width of [320, 375]) {
    test(`badge kategori dan stok tidak bertumpuk (${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await open(page, '/products');
      const overlaps = await page.locator('article').evaluateAll((cards) => cards.flatMap((card) => {
        const cat = card.querySelector('[data-badge=kategori]');
        const stock = card.querySelector('[data-badge=stok]');
        if (!cat || !stock) return [];
        const c = cat.getBoundingClientRect();
        const s = stock.getBoundingClientRect();
        return c.right > s.left - 4 ? [card.querySelector('a[href^="/products/"]').getAttribute('href')] : [];
      }));
      expect(overlaps).toEqual([]);
    });
  }
});

async function login(page, email, password = 'modifkan123') {
  await open(page, '/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Masuk' }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

test.describe('poles UI dashboard seller', () => {
  test.use({ viewport: { width: 1280, height: 800 } });
  test.beforeEach(async ({ page }) => { await login(page, 'garasijaya@modifkan.test'); });

  test('Edit Toko: info dan gambar berdampingan di desktop', async ({ page }) => {
    await open(page, '/seller/store/edit');
    const name = await page.getByLabel('Nama toko').boundingBox();
    const image = await page.getByRole('region', { name: 'Gambar toko' }).boundingBox();
    expect(image.x).toBeGreaterThan(name.x + name.width);
    await expect(page.getByRole('button', { name: 'Simpan' })).toBeVisible();
  });

  test('Toko Saya: ada daftar produk toko', async ({ page }) => {
    await open(page, '/seller/store');
    const section = page.getByRole('region', { name: 'Produk toko' });
    await expect(section).toBeVisible();
    const items = section.getByRole('listitem');
    expect(await items.count()).toBeGreaterThan(0);
    expect(await items.count()).toBeLessThanOrEqual(4);
    await expect(section.getByRole('link', { name: 'Kelola produk' })).toHaveAttribute('href', '/seller/products');
  });
});

test.describe('poles UI dashboard admin', () => {
  test.use({ viewport: { width: 1280, height: 800 } });
  test.beforeEach(async ({ page }) => { await login(page, 'admin@modifkan.test', 'admin12345'); });

  test('Ringkasan: seller menunggu verifikasi dan pesanan terbaru', async ({ page }) => {
    await open(page, '/admin');
    const pending = page.getByRole('region', { name: 'Menunggu verifikasi' });
    await expect(pending).toBeVisible();
    expect(await pending.getByRole('listitem').count()).toBeLessThanOrEqual(5);
    await expect(pending.getByRole('link', { name: /Lihat semua/ })).toHaveAttribute('href', '/admin/sellers');
    const latest = page.getByRole('region', { name: 'Pesanan terbaru' });
    await expect(latest).toBeVisible();
    const rows = latest.locator('tbody tr');
    expect(await rows.count()).toBeGreaterThan(0);
    expect(await rows.count()).toBeLessThanOrEqual(5);
  });

  test('Edit Pengguna: kartu profil di samping form', async ({ page }) => {
    await open(page, '/admin/users/2/edit');
    const profile = page.getByRole('region', { name: 'Profil pengguna' });
    await expect(profile).toBeVisible();
    await expect(profile.getByText('buyer', { exact: true })).toBeVisible();
    const p = await profile.boundingBox();
    const name = await page.getByLabel('Nama').boundingBox();
    expect(name.x).toBeGreaterThan(p.x + p.width);
  });

  test('Edit kategori: satu baris sejajar, Hapus disembunyikan', async ({ page }) => {
    await open(page, '/admin/categories');
    const row = page.getByRole('listitem').filter({ hasText: 'Aksesoris' });
    const before = (await row.boundingBox()).height;
    await expect(async () => {
      await row.getByRole('button', { name: 'Edit' }).click();
      await expect(row.getByRole('button', { name: 'Simpan' })).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 10000 });
    await expect(row.getByRole('button', { name: 'Hapus' })).toHaveCount(0);
    const input = await row.getByRole('textbox').boundingBox();
    const save = await row.getByRole('button', { name: 'Simpan' }).boundingBox();
    const cancel = await row.getByRole('button', { name: 'Batal' }).boundingBox();
    const mid = (b) => b.y + b.height / 2;
    expect(Math.abs(mid(input) - mid(save))).toBeLessThanOrEqual(2);
    expect(Math.abs(mid(save) - mid(cancel))).toBeLessThanOrEqual(2);
    expect((await row.boundingBox()).height).toBeLessThanOrEqual(before + 4);
    await row.getByRole('button', { name: 'Batal' }).click();
    await expect(row.getByRole('button', { name: 'Hapus' })).toBeVisible();
  });
});
