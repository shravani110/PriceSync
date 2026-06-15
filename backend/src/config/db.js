import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn("[db] MONGO_URI not set — running without search caching");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("[db] Connected to MongoDB");
  } catch (err) {
    console.error("[db] Connection failed:", err.message);
  }
}
