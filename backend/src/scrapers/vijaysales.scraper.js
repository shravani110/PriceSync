import axios from "axios";
import { SCRAPER_HEADERS, SCRAPER_TIMEOUT_MS, MAX_RESULTS_PER_STORE } from "../config/constants.js";
import { upscaleVijaySalesImage } from "../utils/imageQuality.js";

const STORE = "Vijay Sales";

const GRAPHQL_ENDPOINT = "https://vsprod.vijaysales.com/graphql";

// Vijay Sales' storefront is Magento + AEM, but product search is exposed
// through a public GraphQL API — query it directly instead of rendering pages.
export async function scrapeVijaySales(query) {
  const gqlQuery = `{
    products(search: ${JSON.stringify(query)}, pageSize: ${MAX_RESULTS_PER_STORE}) {
      items {
        name
        product_url
        rating_summary
        review_count
        image { url }
        price_range {
          maximum_price {
            final_price { value }
            regular_price { value }
          }
        }
      }
    }
  }`;

  const url = `${GRAPHQL_ENDPOINT}?query=${encodeURIComponent(gqlQuery)}`;

  const { data } = await axios.get(url, {
    headers: { ...SCRAPER_HEADERS, Accept: "application/json" },
    timeout: SCRAPER_TIMEOUT_MS,
  });

  const items = data?.data?.products?.items ?? [];

  return items
    .map((item) => {
      const price = item.price_range?.maximum_price?.final_price?.value;
      const originalPrice = item.price_range?.maximum_price?.regular_price?.value ?? price;

      if (!item.name || !price || price < 100 || !item.product_url) return null;

      // Vijay Sales falls back to a generic placeholder image when a
      // product has none of its own — drop it so the matcher doesn't
      // pick a placeholder over a real image from another store.
      const rawImage = item.image?.url;
      const image = rawImage?.includes("vsdefault") ? null : rawImage;

      return {
        store: STORE,
        title: item.name,
        price,
        originalPrice,
        image: upscaleVijaySalesImage(image),
        url: item.product_url,
        rating: item.rating_summary ? Math.round((item.rating_summary / 20) * 10) / 10 : null,
        reviews: item.review_count ?? 0,
      };
    })
    .filter(Boolean);
}
