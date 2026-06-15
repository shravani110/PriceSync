import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    originalPrice: Number,
    url: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    image: String,
    rating: Number,
    reviews: Number,
    tags: [String],
    stores: [storeSchema],
  },
  { _id: false }
);

const searchCacheSchema = new mongoose.Schema({
  query: { type: String, required: true, unique: true, lowercase: true, trim: true },
  results: [productSchema],
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 }, // 1 hour TTL
});

export default mongoose.model("SearchCache", searchCacheSchema);
