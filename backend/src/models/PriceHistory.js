import mongoose from "mongoose";

const storePriceSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
  },
  { _id: false }
);

// One document per (productId, date) — each search that finds a product
// upserts today's entry, so repeat searches the same day overwrite rather
// than duplicate, and the collection grows by one row per product per day.
const priceHistorySchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: String,
  date: { type: String, required: true }, // YYYY-MM-DD
  stores: [storePriceSchema],
});

priceHistorySchema.index({ productId: 1, date: 1 }, { unique: true });

export default mongoose.model("PriceHistory", priceHistorySchema);
