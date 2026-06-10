import { expect, test } from "@playwright/test";

const routes = [
  ["/", /La Otra Mirada/i],
  ["/conferencias", /Conferencias/i],
  ["/galeria", /Galeria|Galería/i],
  ["/noticias", /Noticias/i],
  ["/contacto", /Contacto/i],
  ["/streaming", /Streaming/i],
] as const;

test.describe("public routes", () => {
  for (const [route, heading] of routes) {
    test(`${route} renders`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (message) => {
        if (message.type() !== "error") return;
        if (message.text().includes("net::ERR_NETWORK_ACCESS_DENIED")) return;
        consoleErrors.push(message.text());
      });

      await page.goto(route);
      await expect(page.getByRole("banner")).toBeAttached();
      await expect(page.locator(".lom-header")).not.toHaveClass(/is-visible/);
      await expect(page.getByRole("contentinfo")).toBeVisible();
      await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();
      await expect(page.locator("body")).not.toBeEmpty();
      expect(consoleErrors).toEqual([]);
    });
  }
});
