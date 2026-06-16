import axios from "axios";
import { SCRAPER_HEADERS, SCRAPER_TIMEOUT_MS, MAX_RESULTS_PER_STORE } from "../config/constants.js";

const STORE = "Reliance Digital";

// Reliance Digital's storefront is a Fynd-platform SPA, but its product
// search is served by a plain JSON API — no browser rendering needed.
export async function scrapeRelianceDigital(query) {
  const url = `https://www.reliancedigital.in/ext/raven-api/catalog/v1.0/products?page_id=*&page_size=${MAX_RESULTS_PER_STORE}&q=${encodeURIComponent(query)}`;

  const { data } = await axios.get(url, {
    headers: { ...SCRAPER_HEADERS, Accept: "application/json" },
    timeout: SCRAPER_TIMEOUT_MS,
  });

  const items = data?.items ?? [];

  return items
    .map((item) => {
      const price = item.price?.effective?.min;
      const originalPrice = item.price?.marked?.min ?? price;
      const image = item.medias?.[0]?.url;

      // Prices below ₹10 almost certainly indicate a parsing/API error
      if (!item.name || !price || price < 10 || !item.slug || !item.item_code) return null;

      return {
        store: STORE,
        title: item.name,
        price,
        originalPrice,
        image,
        url: `https://www.reliancedigital.in/${item.slug}/p/${item.item_code}`,
        rating: null,
        reviews: 0,
      };
    })
    .filter(Boolean);
}
