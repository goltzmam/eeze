import { test, expect } from "@playwright/test";
for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
  test(`Today responsive at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/hoje");
    await expect(
      page.getByRole("heading", { name: "Estamos conhecendo sua rotina." }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Conectar minha eaze", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/hoje-${width}.png`,
      fullPage: true,
    });
  });
}
test("all real product routes render honest empty states", async ({ page }) => {
  for (const [route, title] of [
    ["/saude", "Entenda seu ritmo."],
    ["/planos", "Evolua no seu ritmo."],
    ["/ai", "Mais clareza."],
    ["/voce", "Seu espaço. Suas escolhas."],
    ["/voce/minha-eaze", "Conecte sua eaze."],
    ["/moments", "Seu dia, além dos números."],
    ["/insights", "Sua semana com a eaze."],
    ["/voce/privacidade", "Seus dados. Suas escolhas."],
  ]) {
    await page.goto(route);
    await expect(
      page
        .getByRole("heading", {
          name: new RegExp(title.replace(/[.]/g, "\\.")),
        })
        .first(),
    ).toBeVisible();
  }
});
test("account explicitly unavailable without configuration; no pretend successful save", async ({
  page,
  request,
}) => {
  await page.goto("/entrar");
  await expect(
    page.getByRole("button", { name: "Entrar", exact: true }),
  ).toBeDisabled();
  const response = await request.post("/api/moments", {
    headers: { Origin: "http://localhost:3000" },
    data: { kind: "checkin", mood: 3, energy: 3, notes: "technical test" },
  });
  expect(response.status()).toBe(503);
  expect((await response.json()).error).toContain("configurada");
});
test("rejects cross-origin mutations and protects admin", async ({
  request,
  page,
}) => {
  const response = await request.post("/api/plans", {
    headers: { Origin: "https://evil.invalid" },
    data: { goal: "sleep", days: 7, time: "20:00" },
  });
  expect(response.status()).toBe(403);
  await page.goto("/admin");
  await expect(page).toHaveURL(/entrar/);
});
test("PWA manifest, security headers and service worker cache policy", async ({
  request,
  page,
}) => {
  const response = await request.get("/hoje");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["cache-control"]).toContain("no-store");
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.display).toBe("standalone");
  await page.goto("/hoje");
  await page.evaluate(() => navigator.serviceWorker.ready);
  const cached = await page.evaluate(async () => {
    const names = await caches.keys();
    return (
      await Promise.all(
        names.map(async (name) =>
          (await (await caches.open(name)).keys()).map(
            (r) => new URL(r.url).pathname,
          ),
        ),
      )
    ).flat();
  });
  expect(cached).toContain("/offline.html");
  expect(cached.some((p) => p.startsWith("/api/") || p === "/hoje")).toBe(
    false,
  );
});
test("offline navigation falls back without health data", async ({
  page,
  context,
}) => {
  await page.goto("/hoje");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.goto("/saude");
  await expect(
    page.getByRole("heading", { name: "Você está offline." }),
  ).toBeVisible();
  await context.setOffline(false);
});
for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
  test(`secondary routes fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/saude",
      "/planos",
      "/ai",
      "/voce",
      "/voce/minha-eaze",
      "/voce/privacidade",
      "/moments",
      "/insights",
      "/entrar",
      "/onboarding",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
    }
  });
}
import AxeBuilder from "@axe-core/playwright";
test("core routes have no WCAG A/AA violations detected by axe", async ({
  page,
}) => {
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/hoje", "/entrar", "/planos", "/voce/minha-eaze"]) {
      await page.goto(route);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations,
        JSON.stringify(
          result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          null,
          2,
        ),
      ).toEqual([]);
    }
  }
});
