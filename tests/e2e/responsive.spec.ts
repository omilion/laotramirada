import { expect, test } from "@playwright/test";

test("mobile layout has no horizontal overflow on key pages", async ({ page }) => {
  const routes = ["/", "/conferencias", "/galeria", "/contacto", "/streaming"];

  for (const route of routes) {
    await page.goto(route);
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, `${route} should not overflow horizontally`).toBe(false);
  }
});
