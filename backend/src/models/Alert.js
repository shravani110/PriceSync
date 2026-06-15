import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: String, required: true },
  title: String,
  image: String,
  url: String,
  targetPrice: { type: Number, required: true },
  lastSeenPrice: Number,
  triggered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

alertSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model("Alert", alertSchema);
