import { test, expect } from '@playwright/test';

// Setelah server menolak, pilihan peran dan nama toko harus tetap sama dengan yang tampak di layar.
const STARTS = [
  { url: '/register', role: 'Penjual', pick: true },
  { url: '/register?role=seller', role: 'Penjual', pick: false },
  { url: '/register', role: 'Pembeli', pick: false },
  { url: '/register?role=seller', role: 'Pembeli', pick: true },
];
const ERRORS = [
  { name: 'format email', bad: { email: 'salah-email' }, message: 'Format email tidak valid' },
  { name: 'email terdaftar', bad: { email: 'rizky@modifkan.test' }, message: 'Email sudah terdaftar' },
  { name: 'nomor HP', bad: { phone: '123' }, message: /Nomor HP/ },
  { name: 'password pendek', bad: { password: 'abc', confirm: 'abc' }, message: 'Password minimal 8 karakter' },
  { name: 'konfirmasi beda', bad: { confirm: 'beda12345' }, message: 'Konfirmasi password tidak sama' },
];

for (const start of STARTS) {
  for (const [i, err] of ERRORS.entries()) {
    test(`${start.url} sebagai ${start.role}: gagal (${err.name}) dua kali lalu berhasil`, async ({ page }) => {
      const seller = start.role === 'Penjual';
      const good = { email: `reg${i}.${Date.now()}.${Math.floor(Math.random() * 1e6)}@modifkan.test`, phone: '081234567890', password: 'modifkan123', confirm: 'modifkan123' };
      const wrong = { ...good, ...err.bad };
      await page.goto(start.url);
      await page.waitForLoadState('networkidle');
      if (start.pick) await page.getByText(start.role, { exact: true }).click();

      const password = page.getByLabel('Password', { exact: true });
      const confirm = page.getByLabel('Konfirmasi password');
      const store = page.getByLabel('Nama toko');
      async function submit(v) {
        await page.getByLabel('Email').fill(v.email);
        await page.getByLabel('Nomor HP').fill(v.phone);
        await password.fill(v.password);
        await confirm.fill(v.confirm);
        await Promise.all([
          page.waitForResponse((r) => r.request().method() === 'POST'),
          page.getByRole('button', { name: 'Daftar' }).click(),
        ]);
      }

      await page.getByLabel('Nama lengkap').fill('Uji Register');
      if (seller) await store.fill('Toko Uji');
      for (let attempt = 1; attempt <= 2; attempt++) {
        await submit(wrong);
        await expect(page.getByText(err.message).last()).toBeVisible();
        await expect(page.getByRole('button', { name: 'Daftar' })).toBeEnabled();
        await expect(password, `password dikosongkan (percobaan ${attempt})`).toHaveValue('');
        await expect(confirm).toHaveValue('');
        await expect(page.getByRole('radio', { name: start.role }), `peran tetap (percobaan ${attempt})`).toBeChecked();
        await expect(page.getByLabel('Nama lengkap')).toHaveValue('Uji Register');
        if (seller) await expect(store, `nama toko tetap (percobaan ${attempt})`).toHaveValue('Toko Uji');
      }
      await submit(good);
      await expect(page).toHaveURL(seller ? /\/seller\/pending$/ : /:\d+\/$/);
    });
  }
}
