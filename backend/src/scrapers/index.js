import { scrapeAmazon } from "./amazon.scraper.js";
import { scrapeFlipkart } from "./flipkart.scraper.js";
import { scrapeMyntra } from "./myntra.scraper.js";
import { scrapeCroma } from "./croma.scraper.js";
import { scrapeRelianceDigital } from "./reliancedigital.scraper.js";
import { scrapeVijaySales } from "./vijaysales.scraper.js";

const SCRAPERS = [
  { name: "Amazon", run: scrapeAmazon },
  { name: "Flipkart", run: scrapeFlipkart },
  { name: "Myntra", run: scrapeMyntra },
  { name: "Croma", run: scrapeCroma },
  { name: "Reliance Digital", run: scrapeRelianceDigital },
  { name: "Vijay Sales", run: scrapeVijaySales },
];

// Runs all platform scrapers concurrently. A failure in one store
// (block, CAPTCHA, layout change, timeout) never fails the whole search —
// it's logged and that store is simply absent from the results.
export async function scrapeAll(query) {
  const settled = await Promise.allSettled(SCRAPERS.map((s) => s.run(query)));

  const items = [];
  settled.forEach((result, i) => {
    const { name } = SCRAPERS[i];
    if (result.status === "fulfilled") {
      items.push(...result.value);
    } else {
      console.warn(`[scraper] ${name} failed:`, result.reason?.message ?? result.reason);
    }
  });

  return items;
}
