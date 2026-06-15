import rateLimit from "express-rate-limit";

export const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many searches — please wait a moment and try again." },
});
