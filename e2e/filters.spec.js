import { test, expect } from '@playwright/test';

// Handler onChange baru terpasang setelah hidrasi, jadi ulangi sampai URL berubah.
async function sortBy(page, value) {
  await expect(async () => {
    await page.getByLabel('Urutkan').selectOption(value);
    await expect(page).toHaveURL(new RegExp(`sort=${value}`), { timeout: 1500 });
  }).toPass({ timeout: 10000 });
}

const countText = (page) => page.getByText(/^\d+ produk$/).textContent();

test.describe('filter produk (desktop)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('query string rusak diabaikan', async ({ page }) => {
    const res = await page.goto('/products?min=abc&max=-5&sort=xyz&category=1;drop');
    expect(res.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Semua produk' })).toBeVisible();
  });

  test('kategori + harga + sort menghasilkan URL yang bisa dibuka ulang', async ({ page }) => {
    await page.goto('/products');
    const panel = page.getByRole('complementary', { name: 'Filter produk' });
    await panel.getByRole('radio').nth(1).check();
    await panel.getByLabel('Harga minimum').fill('100000');
    await panel.getByLabel('Harga maksimum').fill('5000000');
    await panel.getByRole('button', { name: 'Terapkan' }).click();
    await expect(page).toHaveURL(/category=\d+/);
    await expect(page).toHaveURL(/min=100000/);
    await expect(page).toHaveURL(/max=5000000/);

    await sortBy(page, 'harga_terendah');

    const url = page.url();
    const count = await countText(page);
    await page.goto(url);
    expect(await countText(page)).toBe(count);
    await expect(page.getByLabel('Urutkan')).toHaveValue('harga_terendah');
    await expect(panel.getByLabel('Harga minimum')).toHaveValue('100000');
  });

  test('min > max ditukar', async ({ page }) => {
    await page.goto('/products?min=5000000&max=100000');
    const panel = page.getByRole('complementary', { name: 'Filter produk' });
    await expect(panel.getByLabel('Harga minimum')).toHaveValue('100000');
    await expect(panel.getByLabel('Harga maksimum')).toHaveValue('5000000');
  });

  test('filter rating', async ({ page }) => {
    await page.goto('/products');
    const panel = page.getByRole('complementary', { name: 'Filter produk' });
    const total = Number((await countText(page)).split(' ')[0]);
    await panel.getByRole('radio', { name: /4 ke atas/ }).check();
    await panel.getByRole('button', { name: 'Terapkan' }).click();
    await expect(page).toHaveURL(/rating=4/);
    expect(Number((await countText(page)).split(' ')[0])).toBeLessThan(total);
    await page.reload();
    await expect(panel.getByRole('radio', { name: /4 ke atas/ })).toBeChecked();
    await sortBy(page, 'harga_tertinggi');
    await expect(page).toHaveURL(/rating=4/);
  });

  test('Reset mengosongkan filter', async ({ page }) => {
    await page.goto('/products?min=100000&sort=harga_tertinggi');
    await page.getByRole('complementary', { name: 'Filter produk' }).getByRole('link', { name: 'Reset' }).click();
    await expect(page).toHaveURL(/\/products$/);
  });
});

test.describe('filter produk (HP)', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('tombol Filter membuka bottom sheet', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('complementary', { name: 'Filter produk' })).toBeHidden();
    await page.getByRole('button', { name: 'Filter' }).click();
    const dialog = page.getByRole('dialog', { name: 'Filter produk' });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Harga minimum').fill('100000');
    await dialog.getByRole('button', { name: 'Terapkan' }).click();
    await expect(page).toHaveURL(/min=100000/);
  });
});
