import { test, expect } from '@playwright/test';

test.describe('REQ-001 - Home', () => {

  test('CP-001 - Carga del home', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();
  });

  test('CP-002 - Visualización de contenido', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    const elementos = page.locator('div');

    await expect(elementos.first()).toBeVisible();
  });

  test('CP-003 - Navegación desde home', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    const elementosInteractivos = page.locator('a:visible, button:visible');

    await expect(elementosInteractivos.first()).toBeVisible();

    await elementosInteractivos.first().click();

  
  });

});