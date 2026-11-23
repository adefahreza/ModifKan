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

test.describe('logout', () => {
  test('buyer keluar dari navbar diarahkan ke login', async ({ page }) => {
    await login(page, 'bagas@modifkan.test');
    await page.goto('/');
    await page.getByRole('button', { name: 'Keluar' }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('seller keluar dari dashboard diarahkan ke login', async ({ page }) => {
    await login(page, 'kakikuat@modifkan.test');
    await page.goto('/seller');
    await page.getByRole('button', { name: 'Keluar' }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe('baris pesanan bisa diklik', () => {
  for (const [email, path] of [['speedshop@modifkan.test', '/seller/orders'], ['admin@modifkan.test', '/admin/orders']]) {
    test(`klik di luar nomor pesanan membuka detail (${path})`, async ({ page }) => {
      await login(page, email, email.startsWith('admin') ? 'admin12345' : 'modifkan123');
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const row = page.locator('tbody tr').first();
      expect(await row.evaluate((el) => getComputedStyle(el).cursor)).toBe('pointer');
      // Klik koordinat sel Total (kolom kedua dari kanan): overlay link menutupi sel, jadi klik di sana membuka detail.
      const box = await row.locator('td').nth(-2).boundingBox();
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await expect(page).toHaveURL(new RegExp(`${path}/\\d+$`));
    });

    test(`kartu mobile membuka detail (${path})`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await login(page, email, email.startsWith('admin') ? 'admin12345' : 'modifkan123');
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const card = page.locator('main ul.md\\:hidden > li > a').first();
      expect(await card.evaluate((el) => getComputedStyle(el).cursor)).toBe('pointer');
      await card.locator('p').last().click();
      await expect(page).toHaveURL(new RegExp(`${path}/\\d+$`));
    });
  }
});

test.describe('hapus user dengan pesanan berjalan diblokir', () => {
  // Data seed: rizky punya pesanan berjalan sebagai pembeli, toko speedshop punya pesanan berjalan.
  for (const [email, pesan] of [
    ['rizky@modifkan.test', /masih ada \d+ pesanan berjalan sebagai pembeli/],
    ['speedshop@modifkan.test', /toko miliknya masih punya \d+ pesanan berjalan/],
  ]) {
    test(`menolak hapus ${email}`, async ({ page }) => {
      await login(page, 'admin@modifkan.test', 'admin12345');
      await page.goto(`/admin/users?q=${encodeURIComponent(email)}`);
      await page.waitForLoadState('networkidle');
      const row = page.locator('tbody tr', { hasText: email });
      await row.getByRole('button', { name: 'Hapus' }).click();
      const dialog = page.getByRole('dialog');
      await dialog.getByRole('button', { name: 'Ya, hapus' }).click();
      await expect(dialog.getByRole('alert')).toHaveText(pesan);

      await page.reload();
      await expect(page.locator('tbody tr', { hasText: email })).toHaveCount(1);
    });
  }
});
