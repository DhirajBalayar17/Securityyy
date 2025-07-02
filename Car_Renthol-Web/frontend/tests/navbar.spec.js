import { test, expect } from '@playwright/test';

test.describe('Navbar Component Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  });

  test('should load the navbar correctly', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should contain navigation links', async ({ page }) => {
    const navLinks = ['HOME', 'CARS', 'ABOUT'];
    for (const link of navLinks) {
      await expect(page.getByRole('link', { name: link })).toBeVisible();
    }
  });

});
