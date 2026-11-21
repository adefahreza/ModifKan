import { test } from '@playwright/test';

test('halaman utama: screenshot', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({
    path: testInfo.outputPath('home.png'),
    fullPage: true,
  });
});
