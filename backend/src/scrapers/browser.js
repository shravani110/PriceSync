import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

let browserPromise = null;

// Lazily launches a single shared Chromium instance, reused across
// searches. Each scraper opens its own page (tab) and closes it when done.
export function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer
      .launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-blink-features=AutomationControlled",
        ],
      })
      .then((browser) => {
        // If the shared browser process crashes/closes mid-session, drop
        // the cached promise so the next request launches a fresh one
        // instead of every scrape silently failing from then on.
        browser.once("disconnected", () => {
          browserPromise = null;
        });
        return browser;
      });
  }
  return browserPromise;
}

export async function closeBrowser() {
  if (browserPromise) {
    const browser = await browserPromise;
    await browser.close();
    browserPromise = null;
  }
}

export async function withPage(fn) {
  let browser = await getBrowser();
  let page;
  try {
    page = await browser.newPage();
  } catch {
    // Cached browser is dead but hadn't fired "disconnected" yet — relaunch.
    browserPromise = null;
    browser = await getBrowser();
    page = await browser.newPage();
  }
  try {
    await page.setViewport({ width: 1366, height: 900 });
    return await fn(page);
  } finally {
    await page.close();
  }
}
