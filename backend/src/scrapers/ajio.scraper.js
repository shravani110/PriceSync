import axios from "axios";
import { SCRAPER_HEADERS, SCRAPER_TIMEOUT_MS, MAX_RESULTS_PER_STORE } from "../config/constants.js";

const STORE = "AJIO";

// AJIO runs on Salesforce Commerce Cloud (OCC). Their search is backed by
// a JSON API — query it directly instead of rendering the SPA.
export async function scrapeAjio(query) {
  const url = `https://www.ajio.com/api/search?fields=SITE&currentPage=0&pageSize=${MAX_RESULTS_PER_STORE}&format=json&query=${encodeURIComponent(query)}`;

  const { data } = await axios.get(url, {
    headers: {
      ...SCRAPER_HEADERS,
      Accept: "application/json",
      Referer: "https://www.ajio.com/",
      Origin: "https://www.ajio.com",
    },
    timeout: SCRAPER_TIMEOUT_MS,
  });

  const products = data?.searchResults?.products ?? data?.products ?? [];

  return products
    .slice(0, MAX_RESULTS_PER_STORE)
    .map((item) => {
      const price = item.price?.value ?? item.wasPriceData?.value;
      const originalPrice = item.wasPriceData?.value ?? price;
      const image = item.images?.[0]?.url ?? item.image?.url;
      const href = item.url ?? item.code;

      if (!item.name || !price || !href) return null;

      return {
        store: STORE,
        title: item.name,
        price,
        originalPrice: originalPrice ?? price,
        image: image ? (image.startsWith("http") ? image : `https://assets.ajio.com${image}`) : null,
        url: href.startsWith("http") ? href : `https://www.ajio.com${href}`,
        rating: item.averageRating ? Math.round(item.averageRating * 10) / 10 : null,
        reviews: item.numberOfReviews ?? 0,
      };
    })
    .filter(Boolean);
}
