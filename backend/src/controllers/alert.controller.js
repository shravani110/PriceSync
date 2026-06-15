import Alert from "../models/Alert.js";
import User from "../models/User.js";

export async function listAlerts(req, res, next) {
  try {
    const alerts = await Alert.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ alerts });
  } catch (err) {
    next(err);
  }
}

export async function setAlert(req, res, next) {
  try {
    const { productId, title, image, url, targetPrice, currentPrice } = req.body;

    if (!productId || !targetPrice || targetPrice <= 0) {
      return res.status(400).json({ error: "productId and a positive targetPrice are required" });
    }

    const user = await User.findById(req.userId);
    if (!user?.emailVerified) {
      return res.status(403).json({ error: "Please verify your email before setting price alerts" });
    }

    const alert = await Alert.findOneAndUpdate(
      { userId: req.userId, productId },
      {
        userId: req.userId,
        productId,
        title,
        image,
        url,
        targetPrice,
        lastSeenPrice: currentPrice ?? null,
        triggered: false,
      },
      { upsert: true, new: true }
    );

    res.json({ alert });
  } catch (err) {
    next(err);
  }
}

export async function clearAlert(req, res, next) {
  try {
    await Alert.deleteOne({ userId: req.userId, productId: req.params.productId });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
