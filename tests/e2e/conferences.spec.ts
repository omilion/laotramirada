import { expect, test } from "@playwright/test";

test("conference archive links to an editorial landing", async ({ page }) => {
  await page.goto("/conferencias");
  const firstCard = page.locator(".conference-card").first();
  await expect(firstCard).toBeVisible();

  const href = await firstCard.getAttribute("href");
  expect(href).toMatch(/^\/conferencias\/[^/]+$/);

  await firstCard.click();
  await expect(page).toHaveURL(/\/conferencias\/[^/]+$/);
  await expect(page.locator(".video-stage iframe")).toBeVisible();
  await expect(page.getByRole("link", { name: /Ver conferencia/i })).toBeVisible();
  await expect(page.getByText("Abstract")).toBeVisible();
  await expect(page.getByText("Voz invitada")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Resumen", exact: true })).toBeVisible();
});

test("conference search filters visible cards", async ({ page }) => {
  await page.goto("/conferencias");
  await expect(page.locator(".conference-card").first()).toBeVisible();
  await page.getByPlaceholder(/Buscar por expositor/i).fill("Niall");
  await expect(page.locator(".conference-card")).not.toHaveCount(0);
  await expect(page.locator(".conference-card").first()).toContainText(/Niall/i);
});

test("conference archive keeps filters sticky and cards aligned", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/conferencias");

  const toolbarPosition = await page.locator(".archive-toolbar").evaluate((element) => {
    return window.getComputedStyle(element).position;
  });
  expect(toolbarPosition).toBe("sticky");

  const cardBoxes = await page.locator(".archive-mosaic .conference-card").evaluateAll((cards) => {
    return cards.slice(0, 6).map((card) => {
      const rect = card.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        height: Math.round(rect.height),
      };
    });
  });

  expect(cardBoxes).toHaveLength(6);
  expect(new Set(cardBoxes.slice(0, 3).map((box) => box.top)).size).toBe(1);
  expect(new Set(cardBoxes.slice(0, 3).map((box) => box.height)).size).toBe(1);
  expect(new Set(cardBoxes.slice(3, 6).map((box) => box.top)).size).toBe(1);
  expect(new Set(cardBoxes.slice(3, 6).map((box) => box.height)).size).toBe(1);
});

test("internal navigation resets to top with hidden navbar", async ({ page }) => {
  await page.goto("/conferencias");
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(page.locator(".lom-header")).toHaveClass(/is-visible/);

  await page.locator(".conference-card").first().click();
  await expect(page).toHaveURL(/\/conferencias\/[^/]+$/);
  await page.waitForFunction(() => window.scrollY === 0);
  await expect(page.locator(".lom-header")).not.toHaveClass(/is-visible/);
});

test("conference detail watch button scrolls to the video below the summary", async ({ page }) => {
  await page.goto("/conferencias/la-otra-mirada-a-la-geopolitica-y-la-seguridad");

  const watchButton = page.getByRole("link", { name: /Ver conferencia/i });
  await expect(watchButton).toBeVisible();
  await expect(page.getByRole("heading", { name: "Resumen", exact: true })).toBeVisible();

  await watchButton.click();
  await page.waitForFunction(() => {
    const videoSection = document.querySelector("#video-conferencia");
    if (!videoSection) return false;
    const rect = videoSection.getBoundingClientRect();
    return window.scrollY > 0 && rect.top >= 0 && rect.top < window.innerHeight * 0.45;
  });

  await expect(page.locator("#video-conferencia .video-stage iframe")).toBeVisible();
});
