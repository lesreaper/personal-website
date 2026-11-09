import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import http from "node:http";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:4173";
const localChrome = "/tmp/uat-chrome/chrome-linux64/chrome";
const executablePath =
  process.env.CHROME_PATH ??
  (existsSync(localChrome) ? localChrome : undefined);
mkdirSync("outputs", { recursive: true });
const results = [],
  failures = [],
  pageErrors = [];
let reportResults = [];
const selectedChecks = process.env.BROWSER_CHECK_FILTER
  ? new RegExp(process.env.BROWSER_CHECK_FILTER)
  : null;
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
page.on("pageerror", (error) => pageErrors.push(String(error)));
// Video activation is tested without relying on third-party availability.
await context.route("https://www.youtube-nocookie.com/**", (route) =>
  route.fulfill({
    status: 200,
    contentType: "text/html",
    body: '<html lang="en"><title>Recording embed test</title><body>Recording embed loaded</body></html>',
  }),
);
async function check(name, action) {
  if (selectedChecks && !selectedChecks.test(name)) return;
  try {
    await action();
    results.push({ name, status: "passed" });
    console.log(`PASS ${name}`);
  } catch (error) {
    const message = error.stack ?? String(error);
    results.push({ name, status: "failed", message });
    failures.push({ name, message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}
async function visit(path) {
  const response = await page.goto(base + path, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, `${path} should return 200`);
  await page.evaluate(() => document.fonts.ready);
}
async function noOverflow(path) {
  const dimensions = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert.ok(
    dimensions.document <= dimensions.viewport + 1 &&
      dimensions.body <= dimensions.viewport + 1,
    `${path} overflows: ${JSON.stringify(dimensions)}`,
  );
}
async function loadImages() {
  const size = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    viewport: innerHeight,
  }));
  for (let y = 0; y < size.height; y += size.viewport) {
    await page.evaluate((position) => scrollTo(0, position), y);
    await page.waitForTimeout(60);
  }
  await page
    .locator("img")
    .evaluateAll((images) =>
      Promise.all(images.map((image) => image.decode().catch(() => undefined))),
    );
  await page.evaluate(() => scrollTo(0, 0));
}
async function axe(path, suffix) {
  const report = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const significant = report.violations.filter((item) =>
    ["critical", "serious"].includes(item.impact),
  );
  writeFileSync(`outputs/axe-${suffix}.json`, JSON.stringify(report, null, 2));
  assert.deepEqual(
    significant.map((item) => ({
      id: item.id,
      impact: item.impact,
      description: item.description,
      nodes: item.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
    [],
    `${path} has serious accessibility issues`,
  );
}
function rawRequest(path, { method = "GET", host } = {}) {
  return new Promise((resolve, reject) => {
    const target = new URL(base);
    const request = http.request(
      {
        hostname: target.hostname,
        port: target.port,
        method,
        path,
        headers: host ? { Host: host } : {},
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () =>
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body: Buffer.concat(chunks),
          }),
        );
      },
    );
    request.on("error", reject);
    request.end();
  });
}
try {
  await check(
    "desktop home renders identity, navigation, real imagery and local fonts",
    async () => {
      await visit("/");
      assert.equal(await page.locator("h1").count(), 1);
      assert.match(await page.locator("main").innerText(), /Richard\s+Everts/i);
      for (const label of ["Work", "Ideas", "About", "Speaking"])
        assert.equal(
          await page
            .getByRole("navigation", { name: "Main navigation" })
            .getByRole("link", { name: label, exact: true })
            .count(),
          1,
        );
      await loadImages();
      const images = await page.locator("img").evaluateAll((items) =>
        items.map((item) => ({
          src: item.getAttribute("src"),
          complete: item.complete,
          width: item.naturalWidth,
        })),
      );
      assert.ok(images.length > 0, "Home should include real project images");
      assert.deepEqual(
        images.filter((item) => !item.complete || item.width === 0),
        [],
      );
      const fonts = await page.evaluate(() =>
        [...document.fonts].map((font) => ({
          family: font.family,
          status: font.status,
        })),
      );
      assert.ok(
        fonts.some(
          (font) => /Playfair/.test(font.family) && font.status === "loaded",
        ),
      );
      assert.ok(
        fonts.some(
          (font) => /SourceSans/.test(font.family) && font.status === "loaded",
        ),
      );
      await noOverflow("/");
      await page.screenshot({
        path: "outputs/home-desktop.png",
        fullPage: true,
        animations: "disabled",
      });
    },
  );
  await check("keyboard skip link reaches the main content", async () => {
    await visit("/");
    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(() => document.activeElement?.textContent),
      "Skip to content",
    );
    await page.keyboard.press("Enter");
    assert.ok(page.url().endsWith("#main"));
  });
  await check(
    "approved hero, five branches, and selected-work navigation",
    async () => {
      await visit("/");
      assert.match(
        await page.locator("h1").innerText(),
        /Exploring minds.\s+Building futures./,
      );
      assert.deepEqual(
        await page.locator(".selected-project h3").allTextContents(),
        [
          "Deep SIML Labs",
          "Bestie Bot",
          "Books",
          "The United States of Autism",
          "AI Talks & Leadership",
        ],
      );
      assert.equal(
        await page.locator(".living-sculpture").getAttribute("alt"),
        "",
      );
      await page
        .getByRole("link", { name: "Explore the work", exact: true })
        .click();
      assert.ok(page.url().endsWith("#selected-work"));
      assert.equal(await page.locator("canvas").count(), 0);
    },
  );
  await check(
    "archive search, empty state, reset and topic filters",
    async () => {
      await visit("/research");
      const initial = await page.locator(".archive-grid .entry-card").count();
      assert.ok(initial > 3);
      const search = page.getByRole("searchbox");
      await search.fill("Stardate");
      assert.equal(await page.locator(".archive-grid .entry-card").count(), 1);
      await search.fill("zzzz-no-research-matches");
      assert.equal(await page.locator(".archive-grid .entry-card").count(), 0);
      await page.getByRole("button", { name: "Reset search" }).click();
      assert.equal(await search.inputValue(), "");
      assert.equal(
        await page.locator(".archive-grid .entry-card").count(),
        initial,
      );
      const buttons = page
        .getByRole("group", { name: "Filter by topic" })
        .getByRole("button");
      let topicIndex = 1;
      // Find a selective topic rather than assuming the editorial corpus never changes.
      for (let index = 1; index < (await buttons.count()); index++) {
        await buttons.nth(index).click();
        if (
          (await page.locator(".archive-grid .entry-card").count()) < initial
        ) {
          topicIndex = index;
          break;
        }
      }
      assert.equal(
        await buttons.nth(topicIndex).getAttribute("aria-pressed"),
        "true",
      );
      const filtered = await page.locator(".archive-grid .entry-card").count();
      assert.ok(filtered > 0 && filtered < initial);
      await buttons.getByText("All", { exact: true }).click();
      assert.equal(
        await page.locator(".archive-grid .entry-card").count(),
        initial,
      );
      await page.screenshot({
        path: "outputs/research-desktop.png",
        fullPage: true,
        animations: "disabled",
      });
    },
  );
  await check("recording loads only after a visitor requests it", async () => {
    const response = await context.request.get(base + "/sitemap.xml");
    const xml = await response.text();
    const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => new URL(match[1]).pathname,
    );
    const path = routes.find((route) => /speaking\/.*human/.test(route));
    assert.ok(path, "Expected known verified human-level AI talk");
    await visit(path);
    assert.equal(await page.locator("iframe").count(), 0);
    await page.getByRole("button", { name: /Watch the recording/ }).click();
    const frame = page.locator("iframe");
    assert.equal(await frame.count(), 1);
    assert.match(
      await frame.getAttribute("src"),
      /youtube-nocookie\.com\/embed\/SNIZbClZcF0/,
    );
    assert.ok(await frame.getAttribute("title"));
  });
  await check("resume page and every download are withdrawn", async () => {
    for (const path of [
      "/resume",
      "/resume/",
      "/resume.html",
      "/resume.md",
      "/Richard-Everts-Resume.pdf",
    ]) {
      const response = await context.request.get(base + path);
      assert.equal(response.status(), 410, path);
      assert.match(response.headers()["cache-control"], /no-store/);
    }
    await visit("/about");
    assert.equal(await page.locator('a[href*="resume" i]').count(), 0);
    for (const path of [
      "/llms.txt",
      "/sitemap.xml",
      "/profile.json",
      "/index.md",
      "/about.md",
    ]) {
      const response = await context.request.get(base + path);
      assert.equal(response.status(), 200);
      assert.ok(
        !/\/resume(?:[/.]|$)|Richard-Everts-Resume\.pdf/i.test(
          await response.text(),
        ),
        path,
      );
    }
  });
  await check(
    "desktop representative pages pass serious accessibility checks",
    async () => {
      for (const [path, name] of [
        ["/", "home-desktop"],
        ["/about", "about-desktop"],
        ["/research", "research-desktop"],
        ["/speaking", "speaking-desktop"],
        ["/work/the-united-states-of-autism", "film-desktop"],
        ["/writing/on-terran-liberty", "book-desktop"],
      ]) {
        await visit(path);
        await axe(path, name);
      }
    },
  );
  await check("mobile menu opens, closes, and navigates", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await visit("/");
    const menu = page.getByRole("button", { name: "Menu" });
    assert.ok(await menu.isVisible());
    await menu.click();
    assert.equal(
      await page
        .getByRole("button", { name: "Close" })
        .getAttribute("aria-expanded"),
      "true",
    );
    await page.getByRole("button", { name: "Close" }).click();
    assert.equal(
      await page
        .getByRole("button", { name: "Menu" })
        .getAttribute("aria-expanded"),
      "false",
    );
    await page.getByRole("button", { name: "Menu" }).click();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Ideas", exact: true })
      .click();
    await page.waitForURL(base + "/research");
    assert.equal(
      await page
        .getByRole("button", { name: "Menu" })
        .getAttribute("aria-expanded"),
      "false",
    );
  });
  await check(
    "all sitemap routes render a single h1 without mobile horizontal overflow",
    async () => {
      const response = await context.request.get(base + "/sitemap.xml");
      const routes = [
        ...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g),
      ].map((match) => new URL(match[1]).pathname);
      assert.ok(
        routes.length >= 30,
        `Expected complete archive, got ${routes.length}`,
      );
      const problems = [];
      for (const path of routes) {
        try {
          await visit(path);
          assert.equal(
            await page.locator("h1").count(),
            1,
            `Expected one h1: ${path}`,
          );
          await noOverflow(path);
        } catch (error) {
          problems.push(`${path}: ${error.message}`);
        }
      }
      assert.deepEqual(problems, []);
      results.push({
        name: "sitemap route count",
        status: "passed",
        count: routes.length,
      });
    },
  );
  await check("mobile home, archive, and about remain accessible", async () => {
    for (const [path, name] of [
      ["/", "home-mobile"],
      ["/about", "about-mobile"],
      ["/research", "research-mobile"],
    ]) {
      await visit(path);
      await axe(path, name);
      await loadImages();
      await page.screenshot({
        path: `outputs/${name}.png`,
        fullPage: true,
        animations: "disabled",
      });
    }
  });
  await check(
    "approved artwork retains its identity with reduced motion",
    async () => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await visit("/");
      assert.ok(await page.locator(".living-sculpture").isVisible());
      assert.ok(
        await page
          .locator(".living-sculpture")
          .evaluate((image) => image.complete && image.naturalWidth > 0),
      );
      assert.equal(await page.locator("canvas").count(), 0);
    },
  );
  await check(
    "core biography and archive links are readable without JavaScript",
    async () => {
      const noJs = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width: 1440, height: 1000 },
      });
      const staticPage = await noJs.newPage();
      await staticPage.goto(base);
      assert.match(
        await staticPage.locator("main").innerText(),
        /Richard\s+Everts/i,
      );
      await staticPage.goto(base + "/research");
      assert.ok((await staticPage.locator(".entry-card h3 a").count()) > 3);
      await noJs.close();
    },
  );
  await check(
    "HTTP status, private-file boundaries, methods and canonical redirects",
    async () => {
      const head = await rawRequest("/", { method: "HEAD" });
      assert.equal(head.status, 200);
      assert.equal(head.body.length, 0);
      for (const path of [
        "/does-not-exist",
        "/docs/Resume_April_2026.pdf",
        "/.env",
        "/.git/HEAD",
        "/%2e%2e%2fdocs%2fResume_April_2026.pdf",
      ])
        assert.equal((await rawRequest(path)).status, 404, path);
      const post = await rawRequest("/", { method: "POST" });
      assert.equal(post.status, 405);
      assert.equal(post.headers.allow, "GET, HEAD");
      const www = await rawRequest("/research?topic=SIML", {
        host: "www.richeverts.com",
      });
      assert.equal(www.status, 308);
      assert.equal(
        www.headers.location,
        "https://richeverts.com/research?topic=SIML",
      );
      const legacy = await rawRequest(
        "/february-and-march-lancaster-ai-meetup-fun/?from=old",
      );
      assert.equal(legacy.status, 308);
      assert.equal(legacy.headers.location, "/speaking?from=old");
    },
  );
  await check("no browser JavaScript errors during visitor flows", async () =>
    assert.deepEqual(pageErrors, []),
  );
} finally {
  await browser.close();
  const previous =
    selectedChecks && existsSync("outputs/browser-check.json")
      ? JSON.parse(readFileSync("outputs/browser-check.json", "utf8")).results
      : [];
  const merged = [
    ...previous.filter(
      (item) => !results.some((current) => current.name === item.name),
    ),
    ...results,
  ];
  reportResults = merged;
  const remainingFailures = merged.filter((item) => item.status === "failed");
  writeFileSync(
    "outputs/browser-check.json",
    JSON.stringify(
      {
        base,
        results: merged,
        failures: remainingFailures,
        pageErrors,
        lastRunFilter: selectedChecks?.source ?? null,
      },
      null,
      2,
    ),
  );
}
const reportFailures = reportResults.filter((item) => item.status === "failed");
if (reportFailures.length) {
  console.error(
    `${reportFailures.length} browser checks failed. See outputs/browser-check.json.`,
  );
  process.exitCode = 1;
} else
  console.log(
    `All ${reportResults.length} browser checks passed (${results.length} checked this run).`,
  );
