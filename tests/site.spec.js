// What a visitor does on the portfolio, checked in a real browser.
// GitHub and the chmod calculator API are replaced by fixed answers, and every
// other outside request is blocked, so the tests never depend on the network.
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const MODE_4755 = fs.readFileSync(path.join(__dirname, "fixture-4755.json"), "utf8");
const RELEASES = [
  { tag_name: "v9.9", published_at: "2026-10-16T16:40:00Z", html_url: "https://github.com/Hennashakil/whycant/releases/tag/v9.9",
    draft: false, assets: [{ download_count: 4 }, { download_count: 3 }] },
  { tag_name: "v1.0", published_at: "2026-10-15T16:25:00Z", html_url: "https://github.com/Hennashakil/whycant/releases/tag/v1.0",
    draft: false, assets: [{ download_count: 5 }] },
];

test.beforeEach(async ({ page }, info) => {
  page.errors = [];
  page.api = [];
  page.on("pageerror", (e) => page.errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) page.errors.push(m.text()); });
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => {
    const url = new URL(route.request().url());
    const offline = info.title.includes("offline");
    if (url.hostname === "api.github.com" && !offline)
      return route.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(RELEASES) });
    if (url.hostname.endsWith(".onrender.com")) {
      page.api.push(url.hostname + url.pathname);
      const down = offline || (info.title.includes("second server") && url.hostname.includes("59m0"));
      if (down || !url.pathname.startsWith("/api/mode/")) return route.abort();
      return route.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: MODE_4755 });
    }
    return route.abort();
  });
});

test.afterEach(async ({ page }) => {
  expect(page.errors, "no JavaScript errors").toEqual([]);
});

async function axeCheck(page, label) {
  await page.addScriptTag({ content: AXE });
  const result = await page.evaluate(() => window.axe.run(document, {
    runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
  }));
  const found = result.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")})`);
  expect(found, `accessibility problems ${label}`).toEqual([]);
}

test("the page loads with the right title and no horizontal scrolling", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle(/Henna Shakil/);
  await expect(page.locator("h1")).toContainText("Henna");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("no accessibility problems, before and after using the live demo", async ({ page }) => {
  await page.goto("./");
  await axeCheck(page, "on load");
  await page.locator('#ask-presets [data-mode="4755"]').click();
  await expect(page.locator(".api-mode")).toBeVisible();
  await axeCheck(page, "with an answer on screen");
});

test("whycant's latest release comes live from GitHub", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator("#ws-version")).toHaveText("v9.9");
  await expect(page.locator("#ws-downloads")).toHaveText("12");
  await expect(page.locator("#now-main a")).toHaveText("whycant v9.9");
  await expect(page.locator("#now-main a")).toHaveAttribute("href", RELEASES[0].html_url);
  await expect(page.locator("#live-dot")).toHaveClass(/on/);
});

test("when GitHub and the API are offline the page still makes sense", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator("#ws-version")).toHaveText(/^v\d/);
  await page.locator('#ask-presets [data-mode="777"]').click();
  await expect(page.locator("#ask-out")).toContainText("The server didn’t answer");
  await expect(page.locator("#ask-btn")).toBeEnabled();
});

test("the chmod calculator answers live", async ({ page }) => {
  await page.goto("./");
  await page.locator('#ask-presets [data-mode="4755"]').click();
  await expect(page.locator(".api-mode")).toHaveText("rwsr-xr-x");
  await expect(page.locator("#ask-out")).toContainText("setuid");
  await expect(page.locator("#ask-out .flags .danger")).toBeVisible();
  await expect(page.locator("#ask-mode")).toHaveValue("4755");
});

test("the second server answers when the first one is down", async ({ page }) => {
  await page.goto("./");
  await page.locator("#ask-mode").fill("4755");
  await page.locator("#ask-btn").click();
  await expect(page.locator(".api-mode")).toBeVisible();
  await expect(page.locator("#ask-out")).toContainText("chmod-calculator-1.onrender.com");
});

test("bad input is caught before anything is sent", async ({ page }) => {
  await page.goto("./");
  await page.locator("#ask-mode").fill("rm -rf /");
  await page.locator("#ask-btn").click();
  await expect(page.locator("#ask-out [role=alert]")).toContainText("That isn’t a permission");
  expect(page.api.filter((u) => u.includes("/api/"))).toEqual([]);
});

test("a skip link lets keyboard users jump past the header", async ({ page }) => {
  await page.goto("./");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});
