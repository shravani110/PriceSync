import mongoose from "mongoose";
import PriceHistory from "../models/PriceHistory.js";

export async function getPriceHistory(req, res, next) {
  try {
    const { productId } = req.params;

    if (mongoose.connection.readyState !== 1) {
      return res.json({ productId, history: [] });
    }

    const entries = await PriceHistory.find({ productId }).sort({ date: 1 });

    res.json({
      productId,
      history: entries.map((entry) => ({ date: entry.date, stores: entry.stores })),
    });
  } catch (err) {
    next(err);
  }
}
