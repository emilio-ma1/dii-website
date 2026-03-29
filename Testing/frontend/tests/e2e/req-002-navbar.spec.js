import { test, expect } from '@playwright/test';

test.describe('REQ-002 - Navbar', () => {

  test('CP-NAV-01 - Visualización de navegación', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // fallback por si no hay <nav>
    const nav = page.locator('nav, header, [role="navigation"]');

    await expect(nav.first()).toBeVisible();
  });

  test('CP-NAV-02 - Interacción con navegación', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const elementosNav = page.locator('nav a:visible, nav button:visible, header a:visible');

    if (await elementosNav.count() > 0) {
      await elementosNav.first().click();
    } else {
      throw new Error('No se detectan elementos interactivos en navegación');
    }
  });

});