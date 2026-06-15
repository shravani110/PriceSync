import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import searchRoutes from "./routes/search.routes.js";
import authRoutes from "./routes/auth.routes.js";
import alertRoutes from "./routes/alert.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { closeBrowser } from "./scrapers/browser.js";
import { startAlertChecker } from "./jobs/checkAlerts.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN?.split(",") || "*";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", searchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/alerts", alertRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`[server] PriceSync API listening on port ${PORT}`));
  startAlertChecker();
});

async function shutdown() {
  console.log("[server] Shutting down...");
  await closeBrowser();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
