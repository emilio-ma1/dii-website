import { test, expect } from '@playwright/test';

test.describe('REQ-004 - Panel Admin', () => {

  test('CP-ADMIN-01 - Acceso a panel admin (flujo real)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // ir a login desde UI
    const loginBtn = page.getByRole('link', { name: /login|iniciar/i });
    if (await loginBtn.count() > 0) {
      await loginBtn.click();
    }

    await page.waitForTimeout(2000);

    const inputs = page.locator('input');

    if (await inputs.count() >= 2) {
      await inputs.nth(0).fill('admin@userena.cl');
      await inputs.nth(1).fill('admin123');

      await page.locator('button').click();

      await expect(page).toHaveURL(/admin|dashboard/);
    } else {
      throw new Error('No se puede validar acceso admin');
    }
  });

});