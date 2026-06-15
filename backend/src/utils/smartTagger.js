const STEAL_DISCOUNT_THRESHOLD = 0.35; // 35%+ off the highest listed price
const TRENDING_REVIEW_THRESHOLD = 1000;
const BEST_PRICE_SPREAD_THRESHOLD = 0.1; // 10%+ gap between cheapest and priciest store

// Assigns UI badges based on simple, explainable heuristics over the
// aggregated price/review data.
export function applySmartTags(product) {
  const tags = [];

  const prices = product.stores.map((s) => s.price);
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const maxOriginal = Math.max(...product.stores.map((s) => s.originalPrice ?? s.price));

  if (maxOriginal > lowest && (maxOriginal - lowest) / maxOriginal >= STEAL_DISCOUNT_THRESHOLD) {
    tags.push("Ultimate Steal");
  }

  if (product.reviews >= TRENDING_REVIEW_THRESHOLD) {
    tags.push("Trending");
  }

  if (product.stores.length > 1 && highest > 0 && (highest - lowest) / highest >= BEST_PRICE_SPREAD_THRESHOLD) {
    tags.push("Best Price");
  }

  return { ...product, tags };
}
