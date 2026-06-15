import { withPage } from "./browser.js";
import { PAGE_NAV_TIMEOUT_MS, MAX_RESULTS_PER_STORE } from "../config/constants.js";
import { upscaleFlipkartImage } from "../utils/imageQuality.js";

const STORE = "Flipkart";

// Flipkart's class names are obfuscated and rotate frequently, so instead
// of relying on them we anchor on product detail links (always contain
// "/p/itm") and pull title/price/image from that link's container.
export async function scrapeFlipkart(query) {
  const url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;

  return withPage(async (page) => {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: PAGE_NAV_TIMEOUT_MS });

    // Dismiss the login modal that covers search results
    await page.keyboard.press("Escape").catch(() => null);

    await page
      .waitForSelector('a[href*="/p/itm"]', { timeout: PAGE_NAV_TIMEOUT_MS })
      .catch(() => null);

    const items = await page.$$eval(
      'a[href*="/p/itm"]',
      (anchors, max) => {
        const seen = new Set();
        const results = [];

        const isLeaf = (el) => el.children.length === 0;
        const text = (el) => el.textContent.trim();

        for (const a of anchors) {
          if (results.length >= max) break;

          const href = a.getAttribute("href");
          if (!href || seen.has(href)) continue;

          const container = a.closest("div._1AtVbE, div._2kHMtA, div._4ddWXP") || a.parentElement?.parentElement || a;
          const leaves = [...container.querySelectorAll("*")].filter(isLeaf);

          // Price/MRP render as standalone leaf nodes like "₹2,474" — read
          // those directly instead of regexing the concatenated container text.
          const prices = leaves
            .map(text)
            .filter((t) => /^₹[\d,]+$/.test(t))
            .map((t) => Number(t.replace(/[₹,]/g, "")));
          if (prices.length === 0) continue;

          const price = Math.min(...prices);
          const originalPrice = Math.max(...prices);

          const ratingEl = leaves.find((el) => /^\d(\.\d)?$/.test(text(el)));
          const rating = ratingEl ? parseFloat(text(ratingEl)) : null;

          const titleCandidates = leaves
            .map(text)
            .filter((t) => t.length > 10 && !/^₹/.test(t) && !/%\s*off/i.test(t) && !/^\d(\.\d)?$/.test(t));

          const img = container.querySelector("img");
          const visibleTitle = titleCandidates.sort((a, b) => b.length - a.length)[0] || "";
          const altTitle = img?.getAttribute("alt") || "";
          // The visible title is often CSS-truncated with a trailing "..." —
          // the image alt text usually holds the fuller, untruncated name.
          const title = altTitle.length > visibleTitle.length ? altTitle : visibleTitle;
          const image = img?.getAttribute("src");

          seen.add(href);
          results.push({ title, price, originalPrice, image, href, rating });
        }

        return results;
      },
      MAX_RESULTS_PER_STORE
    );

    return items.map((item) => ({
      store: STORE,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      image: upscaleFlipkartImage(item.image),
      url: `https://www.flipkart.com${item.href}`,
      rating: item.rating,
      reviews: 0,
    }));
  });
}
