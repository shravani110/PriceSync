import crypto from "crypto";

// Used when tokenizing PRODUCT TITLES — gender/age terms appear in nearly
// every result for a category search and carry no discriminating power there.
const STOPWORDS = new Set([
  "the", "for", "and", "with", "men", "mens", "men's", "women", "womens",
  "women's", "kids", "pack", "of", "a", "an", "in", "new", "edition",
]);

// Used when tokenizing the USER'S QUERY — gender/age terms ARE meaningful
// here ("womens" in "kurtis for womens" is a real search signal).
const QUERY_STOPWORDS = new Set([
  "the", "for", "and", "with", "pack", "of", "a", "an", "in", "new", "edition",
]);

const SIMILARITY_THRESHOLD = 0.6;

// Recognizable brand names — if two titles each name a DIFFERENT brand from
// this list, they're virtually never the same product, even if they also
// share generic spec words (e.g. "wireless controller gamepad") that would
// otherwise push their similarity score above the threshold.
const BRAND_TOKENS = new Set([
  "sony", "nintendo", "microsoft", "nitho", "thrustmaster", "powera",
  "logitech", "razer", "zebronics", "portronics",
  "apple", "samsung", "oneplus", "xiaomi", "redmi", "poco", "realme",
  "vivo", "oppo", "nothing", "google", "motorola",
  "boat", "jbl", "sennheiser", "noise", "ptron", "boult", "crossbeats",
  "fireboltt", "skullcandy",
  "nike", "adidas", "puma", "reebok", "skechers", "woodland", "bata",
  "levis", "wrangler",
  "titan", "fossil", "casio", "fastrack", "timex",
  "philips", "prestige", "bajaj", "havells", "whirlpool", "panasonic", "lg",
  "dell", "lenovo", "asus", "acer",
]);

function normalize(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

// How many of the result titles (for this search) contain each token.
// A token that shows up in almost every result (e.g. "nike", "shoes") is
// near-useless for telling products apart; a token that shows up in only
// one or two results (e.g. "downshifter", "270") is highly distinguishing.
function buildDocFrequency(tokenSets) {
  const df = new Map();
  for (const tokens of tokenSets) {
    for (const token of new Set(tokens)) {
      df.set(token, (df.get(token) || 0) + 1);
    }
  }
  return df;
}

// IDF-weighted containment: shared rare/specific tokens (model names,
// numbers) count for much more than shared generic category words. We
// measure containment relative to the LESS-detailed of the two titles
// (min of the two weight sums) rather than their full union — Amazon
// titles tend to be long marketing copy stuffed with extra spec words
// that Flipkart/Myntra titles omit, which would otherwise dilute a
// union-based score even when the two listings are the same product.
function weightedSimilarity(tokensA, tokensB, df, total, sameStore) {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;

  let intersectionWeight = 0;
  let weightSumA = 0;
  let weightSumB = 0;
  let sharedCount = 0;
  let sharedRareNumber = false;

  for (const token of union) {
    const weight = Math.log((total + 1) / (df.get(token) || 1));
    if (setA.has(token)) weightSumA += weight;
    if (setB.has(token)) weightSumB += weight;
    if (setA.has(token) && setB.has(token)) {
      intersectionWeight += weight;
      sharedCount++;
      if (/^\d+$/.test(token) && (df.get(token) || 1) <= total / 4) {
        sharedRareNumber = true;
      }
    }
  }

  // Require at least 2 shared tokens — a single shared word (even a rare
  // one) isn't enough to call two listings the same product.
  if (sharedCount < 2 || weightSumA === 0 || weightSumB === 0) return 0;

  // Titles that each name a different model number (e.g. "Rockerz 425" vs
  // "Rockerz 255 Pro") are different products even if they share a wall of
  // templated marketing copy ("ASAP Charge, Stream Ad Free Music via App
  // Support, Bluetooth..."). Only treat a number as a model-number signal
  // when it's rare across this search's results, not a generic spec number.
  const isRareModelNumber = (token) => /^\d{2,4}$/.test(token) && (df.get(token) || 1) <= total / 4;
  const modelNumbersA = tokensA.filter(isRareModelNumber);
  const modelNumbersB = tokensB.filter(isRareModelNumber);
  if (
    modelNumbersA.length &&
    modelNumbersB.length &&
    !modelNumbersA.some((n) => setB.has(n))
  ) {
    return 0;
  }

  // Two listings from the SAME store sharing only generic spec/color words
  // (e.g. both say "white" or "wireless controller") are usually different
  // products, not the same listing under two titles — only merge same-store
  // listings when they share a distinctive model number.
  if (sameStore && !sharedRareNumber) return 0;

  // Titles that each name a different recognized brand (e.g. "NITHO" vs
  // "SONY") are different products regardless of shared spec words, unless
  // they also share a distinctive model number.
  if (!sharedRareNumber) {
    const brandsA = tokensA.filter((t) => BRAND_TOKENS.has(t));
    const brandsB = tokensB.filter((t) => BRAND_TOKENS.has(t));
    if (brandsA.length && brandsB.length && !brandsA.some((b) => setB.has(b))) {
      return 0;
    }
  }

  const containment = intersectionWeight / Math.min(weightSumA, weightSumB);

  // A shared rare model number (e.g. "311", "413") is a very strong
  // same-product signal — give it a small boost over the threshold.
  return sharedRareNumber ? containment + 0.15 : containment;
}

// Generic filler words from natural-language queries ("best phones under
// 30,000") that never appear in product titles — stripped before computing
// relevance so they don't drag a query's match ratio down to zero.
const RELEVANCE_FILLER_WORDS = new Set([
  "phone", "phones", "product", "products", "price", "prices", "budget",
  "cost", "range", "rupees", "rupee", "best", "good", "cheap", "cheapest",
  "top", "under", "over", "above", "below", "between", "within", "around",
  "near", "less", "more", "than", "upto", "rs", "inr",
]);

// Strips price-range phrasing ("under ₹30,000", "below 20000", "Rs. 1,499")
// so the leftover query tokens are just the product description.
function stripPriceQualifiers(text) {
  return text
    .replace(/\b(under|over|above|below|within|around|near|less than|more than|up ?to)\s*(rs\.?|inr|₹)?\s*[\d,]+\b/gi, " ")
    .replace(/(rs\.?|inr|₹)\s*[\d,]+/gi, " ")
    .replace(/\b\d{1,3}(?:,\d{2,3})+\b/g, " ");
}

function tokenize(text, stopwords) {
  return new Set(
    stripPriceQualifiers(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 0 && !stopwords.has(word))
      .flatMap((word) => word.match(/[a-z]+|\d+/g) || [word])
      .filter((token) => token.length > 1 && !RELEVANCE_FILLER_WORDS.has(token))
  );
}

// Title tokens use the full STOPWORDS (gender terms stripped — noisy in titles).
function relevanceTokens(text) { return tokenize(text, STOPWORDS); }

// Query tokens use the smaller QUERY_STOPWORDS so "womens", "mens", "kids"
// are preserved as meaningful search signals.
function queryRelevanceTokens(text) { return tokenize(text, QUERY_STOPWORDS); }

// Stores often return "related"/"you may also like" items alongside (or
// instead of) actual search matches. Drop results that share less than
// half of the query's tokens, so the results page doesn't show products
// unrelated to what the user searched for.
export function filterByQueryRelevance(items, query) {
  const queryTokens = queryRelevanceTokens(query);
  if (queryTokens.size === 0) return items;

  return items.filter((item) => {
    const titleTokens = relevanceTokens(item.title);
    let matched = 0;
    for (const qt of queryTokens) {
      for (const tt of titleTokens) {
        if (qt === tt) { matched++; break; }
        // Prefix match handles plurals and variants:
        // "kurtis"↔"kurti", "shoes"↔"shoe", "womens"↔"women"
        const min = Math.min(qt.length, tt.length);
        if (min >= 4 && qt.slice(0, min) === tt.slice(0, min)) { matched++; break; }
      }
    }
    return matched / queryTokens.size >= 0.5;
  });
}

// Groups raw per-store scrape results into unified products by comparing
// normalized title token overlap, weighted by how distinctive each token
// is across this search's results. This is a heuristic — real product
// matching would use barcodes/SKUs/ML, but title similarity is a
// reasonable free approximation for a portfolio aggregator.
export function matchProducts(items) {
  const tokenSets = items.map((item) => normalize(item.title));
  const df = buildDocFrequency(tokenSets);
  const total = items.length;

  const groups = [];

  items.forEach((item, idx) => {
    const tokens = tokenSets[idx];
    let bestGroup = null;
    let bestScore = 0;

    for (const group of groups) {
      group.tokenSets.forEach((groupTokens, gi) => {
        // A ₹4,000 phone case and a ₹79,900 iPhone share title tokens but
        // are not the same product — skip matching when prices differ >10×.
        const groupItem = group.items[gi];
        if (item.price && groupItem.price) {
          const ratio = Math.max(item.price, groupItem.price) / Math.min(item.price, groupItem.price);
          if (ratio > 10) return;
        }

        const sameStore = groupItem.store === item.store;
        const score = weightedSimilarity(tokens, groupTokens, df, total, sameStore);
        if (score > bestScore) {
          bestScore = score;
          bestGroup = group;
        }
      });
    }

    if (bestGroup && bestScore >= SIMILARITY_THRESHOLD) {
      bestGroup.items.push(item);
      bestGroup.tokenSets.push(tokens);
    } else {
      groups.push({ items: [item], tokenSets: [tokens] });
    }
  });

  return groups.map((group) => buildUnifiedProduct(group.items));
}

// A content-based ID derived from the product's most distinctive title
// tokens — stable across separate searches/days (unlike an index, which
// changes every time results are re-ordered), so wishlist entries and price
// history stay attached to the same product over time.
function generateProductId(title) {
  const tokens = [...new Set(normalize(title))].sort();
  return crypto.createHash("sha1").update(tokens.join(" ")).digest("hex").slice(0, 12);
}

function buildUnifiedProduct(items) {
  const title = items.map((i) => i.title).reduce((a, b) => (b.length > a.length ? b : a));
  const image = items.find((i) => i.image)?.image;

  const ratings = items.filter((i) => i.rating).map((i) => i.rating);
  const rating = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : null;

  const reviews = items.reduce((sum, i) => sum + (i.reviews || 0), 0);

  // A store can list multiple matching results (different sizes/sellers) —
  // keep only the cheapest one per store so the UI shows one price per store.
  const cheapestByStore = new Map();
  for (const item of items) {
    const existing = cheapestByStore.get(item.store);
    if (!existing || item.price < existing.price) {
      cheapestByStore.set(item.store, {
        name: item.store,
        price: item.price,
        originalPrice: item.originalPrice ?? item.price,
        url: item.url,
      });
    }
  }
  const stores = [...cheapestByStore.values()];

  return {
    id: generateProductId(title),
    title,
    image,
    rating,
    reviews,
    tags: [],
    stores,
  };
}
