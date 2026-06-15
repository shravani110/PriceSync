import { withPage } from "./browser.js";
import { PAGE_NAV_TIMEOUT_MS, MAX_RESULTS_PER_STORE } from "../config/constants.js";
import { upscaleCromaImage } from "../utils/imageQuality.js";

const STORE = "Croma";

export async function scrapeCroma(query) {
  const url = `https://www.croma.com/searchB?q=${encodeURIComponent(query)}%3Arelevance&text=${encodeURIComponent(query)}`;

  return withPage(async (page) => {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: PAGE_NAV_TIMEOUT_MS });

    await page
      .waitForSelector("li.product-item", { timeout: PAGE_NAV_TIMEOUT_MS })
      .catch(() => null);

    const items = await page.$$eval(
      "li.product-item",
      (cards, max) =>
        cards
          .slice(0, max)
          .map((card) => {
            const titleEl = card.querySelector("h3.product-title a");
            const priceEl = card.querySelector('[data-testid="new-price"]');
            const oldPriceEl = card.querySelector('[data-testid="old-price"]');
            const img = card.querySelector("img");

            const title = titleEl?.textContent?.trim();
            const priceText = priceEl?.textContent;
            const oldPriceText = oldPriceEl?.textContent;
            const href = titleEl?.getAttribute("href");
            const image = img?.getAttribute("src") || img?.getAttribute("data-src");

            const price = priceText ? Number(priceText.replace(/[^\d]/g, "")) : null;
            if (!title || !price) return null;

            const originalPrice = oldPriceText
              ? Number(oldPriceText.replace(/[^\d]/g, ""))
              : price;

            return { title, price, originalPrice, image, href };
          })
          .filter(Boolean),
      MAX_RESULTS_PER_STORE
    );

    return items.map((item) => ({
      store: STORE,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      image: upscaleCromaImage(item.image),
      url: item.href ? `https://www.croma.com${item.href}` : url,
      rating: null,
      reviews: 0,
    }));
  });
}
