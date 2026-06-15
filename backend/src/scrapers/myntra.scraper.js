import { withPage } from "./browser.js";
import { PAGE_NAV_TIMEOUT_MS, MAX_RESULTS_PER_STORE } from "../config/constants.js";
import { upscaleMyntraImage } from "../utils/imageQuality.js";

const STORE = "Myntra";

// Myntra is a client-rendered SPA — render it with a real browser and
// read the `.product-base` cards once React has painted the grid.
export async function scrapeMyntra(query) {
  const url = `https://www.myntra.com/${encodeURIComponent(query)}`;

  return withPage(async (page) => {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: PAGE_NAV_TIMEOUT_MS });

    await page
      .waitForSelector("li.product-base", { timeout: PAGE_NAV_TIMEOUT_MS })
      .catch(() => null);

    const items = await page.$$eval(
      "li.product-base",
      (cards, max) =>
        cards
          .map((card) => {
            const brand = card.querySelector(".product-brand")?.textContent?.trim();
            const name = card.querySelector(".product-product")?.textContent?.trim();
            // .product-price wraps the discounted price in an extra unclassed
            // <span>, so ".product-price span" alone matches that wrapper
            // (concatenated discounted+strike text). Prefer the specific
            // discounted-price class, then a nested span, then the wrapper.
            const priceEl =
              card.querySelector(".product-discountedPrice") ||
              card.querySelector(".product-price span span") ||
              card.querySelector(".product-price span");
            const priceText = priceEl?.textContent;
            const strikeText = card.querySelector(".product-strike")?.textContent;
            const img = card.querySelector("img");
            const image = img?.getAttribute("src") || img?.getAttribute("data-src");
            const href = card.querySelector("a")?.getAttribute("href");
            const ratingText = card.querySelector(".product-ratingsContainer span")?.textContent;

            const price = priceText ? Number(priceText.replace(/[^\d]/g, "")) : null;
            // Myntra lazy-mounts <img> as cards scroll into view, so cards
            // beyond the first viewport have no image yet — skip those
            // rather than show a broken image.
            if (!price || !image) return null;

            const originalPrice = strikeText ? Number(strikeText.replace(/[^\d]/g, "")) : price;

            return {
              title: [brand, name].filter(Boolean).join(" "),
              price,
              originalPrice,
              image,
              href,
              rating: ratingText ? parseFloat(ratingText) : null,
            };
          })
          .filter(Boolean)
          .slice(0, max),
      MAX_RESULTS_PER_STORE
    );

    return items.map((item) => ({
      store: STORE,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      image: upscaleMyntraImage(item.image),
      url: item.href ? `https://www.myntra.com/${item.href}` : url,
      rating: item.rating,
      reviews: 0,
    }));
  });
}
