import { test, expect } from '@playwright/test';

test.describe('REQ-019 - Login', () => {

  test('CP-LOGIN-01 - Login válido (flujo real)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // navegación real al login
    const loginBtn = page.getByRole('link', { name: /login|iniciar/i });

    await expect(loginBtn).toBeVisible();
    await loginBtn.click();

    await page.waitForSelector('input');

    const inputs = page.locator('input');

    await inputs.nth(0).fill('admin@userena.cl');
    await inputs.nth(1).fill('admin123');

    await page.locator('button').click();

    await expect(page).toHaveURL(/dashboard|admin|home/);
  });

  test('CP-LOGIN-02 - Login inválido', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loginBtn = page.getByRole('link', { name: /login|iniciar/i });

    await expect(loginBtn).toBeVisible();
    await loginBtn.click();

    await page.waitForSelector('input');

    const inputs = page.locator('input');

    await inputs.nth(0).fill('fake@userena.cl');
    await inputs.nth(1).fill('wrongpass');

    await page.locator('button').click();

    await expect(page.locator('text=error')).toBeVisible();
  });

});