import { Router } from "express";
import { searchProducts } from "../controllers/search.controller.js";
import { getPriceHistory } from "../controllers/priceHistory.controller.js";
import { searchRateLimiter } from "../middleware/rateLimiter.js";
import SearchCache from "../models/SearchCache.js";

const router = Router();

router.get("/search", searchRateLimiter, searchProducts);
router.get("/price-history/:productId", getPriceHistory);
router.delete("/cache", async (req, res) => {
  await SearchCache.deleteMany({});
  res.json({ message: "Cache cleared" });
});

export default router;
