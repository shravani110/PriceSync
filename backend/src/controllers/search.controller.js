import mongoose from "mongoose";
import { scrapeAll } from "../scrapers/index.js";
import { matchProducts, filterByQueryRelevance } from "../utils/productMatcher.js";
import { applySmartTags } from "../utils/smartTagger.js";
import SearchCache from "../models/SearchCache.js";
import PriceHistory from "../models/PriceHistory.js";

// Records today's lowest price-per-store for each product so the frontend
// can chart price trends over time. Upserts on (productId, date), so repeat
// searches the same day update rather than duplicate.
async function recordPriceHistory(results) {
  const today = new Date().toISOString().slice(0, 10);

  await Promise.all(
    results.map((product) =>
      PriceHistory.findOneAndUpdate(
        { productId: product.id, date: today },
        {
          productId: product.id,
          title: product.title,
          date: today,
          stores: product.stores.map((s) => ({ name: s.name, price: s.price })),
        },
        { upsert: true }
      )
    )
  );
}

export async function searchProducts(req, res, next) {
  try {
    const query = (req.query.q || "").trim();
    if (!query) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const dbReady = mongoose.connection.readyState === 1;

    // v2: prefix bumped to invalidate caches built before the relevance-filter
    // and price-ratio-guard fixes were deployed.
    const CACHE_VERSION = "v3:";
    const cacheKey = CACHE_VERSION + query.toLowerCase();

    if (dbReady) {
      const cached = await SearchCache.findOne({ query: cacheKey });
      if (cached) {
        const results = filterByQueryRelevance(cached.results, query);
        await recordPriceHistory(results);
        return res.json({ query, results, source: "cache" });
      }
    }

    // A scrape attempt can come back empty if a store hits a transient
    // block/CAPTCHA/timeout (or the shared browser just recovered from a
    // crash) — retry a couple times before giving up on live data.
    let rawItems = [];
    for (let attempt = 0; attempt < 3 && rawItems.length === 0; attempt++) {
      rawItems = await scrapeAll(query);
    }

    const relevantItems = filterByQueryRelevance(rawItems, query);

    // Products matched across more stores are the ones that actually
    // showcase a price *comparison* — surface those first by default so
    // they don't get buried behind single-store listings from whichever
    // store happened to be scraped first.
    const results = matchProducts(relevantItems)
      .map(applySmartTags)
      .sort((a, b) => b.stores.length - a.stores.length);
    const source = "live";

    if (dbReady && results.length > 0) {
      await SearchCache.findOneAndUpdate(
        { query: cacheKey },
        { query: cacheKey, results, createdAt: new Date() },
        { upsert: true }
      );
      await recordPriceHistory(results);
    }

    res.json({ query, results, source });
  } catch (err) {
    next(err);
  }
}
