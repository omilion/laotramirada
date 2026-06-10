import { expect, test } from "@playwright/test";

const routes = [
  ["/", /La Otra Mirada/i],
  ["/conferencias", /Conferencias/i],
  ["/galeria", /Galeria|Galería/i],
  ["/noticias", /Noticias/i],
  ["/noticias/mccloskey-y-las-predicciones-en-economia", /McCloskey y las predicciones/i],
  ["/noticias/agenda-editorial-2026-mirada-larga", /Agenda editorial 2026/i],
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

test("news archive and detail do not render post images", async ({ page }) => {
  await page.goto("/noticias");
  await expect(page.locator(".news-card-link img")).toHaveCount(0);

  await page.goto("/noticias/agenda-editorial-2026-mirada-larga");
  await expect(page.locator(".news-detail img")).toHaveCount(0);
});

test("news detail renders published article content and metadata", async ({ page }) => {
  await page.goto("/noticias/agenda-editorial-2026-mirada-larga");

  await expect(page.locator(".news-detail-meta")).toContainText("La Otra Mirada");
  await expect(page.locator(".news-detail-meta")).toContainText("10:30 hrs");
  await expect(page.locator(".news-detail-main")).toContainText("El ciclo editorial 2024-2026");

  const currentArticle = await page.locator(".news-detail").innerText();
  expect(currentArticle).not.toMatch(
    /Lectura editorial|Por qué importa|Parchar un periodo|deber[ií]a ser|por qu[eé] hay que hacerlo/i,
  );

  await page.goto("/noticias/chile-capitalismo-virtudes-y-musica-electronica");
  const historicalArticle = await page.locator(".news-detail").innerText();
  expect(historicalArticle).not.toMatch(
    /entrada hist[oó]rica|Recuperar este archivo|Restaurar esta entrada|Preservar el perfil|Mantener esta entrada/i,
  );
});
