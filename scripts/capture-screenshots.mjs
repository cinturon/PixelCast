import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "docs", "screenshots");
const baseUrl = process.env.SCREENSHOT_URL ?? "http://127.0.0.1:1420/screenshots.html";
const views = [
  { name: "main", query: "view=main", selector: ".weather-card" },
  { name: "settings", query: "view=settings", selector: "#settings-panel-title" },
  { name: "about", query: "view=about", selector: "#about-modal-title" },
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});

for (const view of views) {
  await page.goto(`${baseUrl}?${view.query}`, { waitUntil: "networkidle" });
  await page.waitForSelector(view.selector, { state: "visible" });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(outputDir, `${view.name}.png`),
    fullPage: false,
  });
  console.log(`Captured docs/screenshots/${view.name}.png`);
}

await browser.close();
