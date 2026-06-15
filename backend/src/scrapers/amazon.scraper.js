import { withPage } from "./browser.js";
import { PAGE_NAV_TIMEOUT_MS, MAX_RESULTS_PER_STORE } from "../config/constants.js";
import { upscaleAmazonImage } from "../utils/imageQuality.js";

const STORE = "Amazon";

// Renders the search results page with a real (stealth) headless browser.
// Amazon still occasionally serves a CAPTCHA to automated traffic — when
// that happens we return [] and the aggregator omits this store.
export async function scrapeAmazon(query) {
  const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;

  return withPage(async (page) => {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: PAGE_NAV_TIMEOUT_MS });

    const blocked = await page.$("form[action*='validateCaptcha']");
    if (blocked) return [];

    await page
      .waitForSelector('div[data-component-type="s-search-result"]', { timeout: PAGE_NAV_TIMEOUT_MS })
      .catch(() => null);

    return page.$$eval(
      'div[data-component-type="s-search-result"]',
      (cards, max) =>
        cards
          .slice(0, max)
          .map((card) => {
            // h2 can contain multiple spans (brand badge + title) — join them all,
            // but drop a leading badge that just repeats the start of the title
            // (e.g. "Nike" + "Nike Mens Downshifter...")
            const spanTexts = [...card.querySelectorAll("h2 span")]
              .map((s) => s.textContent.trim())
              .filter(Boolean);
            if (spanTexts.length > 1 && spanTexts[1].toLowerCase().startsWith(spanTexts[0].toLowerCase())) {
              spanTexts.shift();
            }
            const title = spanTexts.join(" ");
            const priceWhole = card.querySelector("span.a-price-whole")?.textContent?.replace(/[^\d]/g, "");
            const originalPriceText = card.querySelector("span.a-price.a-text-price span.a-offscreen")?.textContent;
            const image = card.querySelector("img.s-image")?.getAttribute("src");
            // The title link is no longer nested inside <h2> — Amazon's
            // current markup wraps the card in a-link-normal anchors with
            // sponsored tracking redirects. The product's ASIN (always on
            // the card itself) is a stable, direct way to build the URL.
            const asin = card.getAttribute("data-asin");
            const ratingText = card.querySelector("span.a-icon-alt")?.textContent;
            const reviewsText = card.querySelector("span.a-size-base.s-underline-text")?.textContent;

            if (!title || !priceWhole || !asin) return null;

            const originalPriceClean = originalPriceText?.replace(/[^\d.]/g, "");

            return {
              title,
              price: Number(priceWhole),
              originalPrice: originalPriceClean ? Number(originalPriceClean) : Number(priceWhole),
              image,
              url: `https://www.amazon.in/dp/${asin}`,
              rating: ratingText ? parseFloat(ratingText) : null,
              reviews: reviewsText ? parseInt(reviewsText.replace(/[^\d]/g, ""), 10) : 0,
            };
          })
          .filter(Boolean),
      MAX_RESULTS_PER_STORE
    ).then((items) =>
      items.map((item) => ({
        ...item,
        store: STORE,
        image: upscaleAmazonImage(item.image),
      }))
    );
  });
}
