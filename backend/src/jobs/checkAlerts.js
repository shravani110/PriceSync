import Alert from "../models/Alert.js";
import PriceHistory from "../models/PriceHistory.js";
import User from "../models/User.js";
import { sendPriceDropEmail } from "../utils/email.js";

const CHECK_INTERVAL_MS = 30 * 60 * 1000;

async function checkAlerts() {
  try {
    const alerts = await Alert.find({ triggered: false });
    if (alerts.length === 0) return;

    for (const alert of alerts) {
      const latest = await PriceHistory.findOne({ productId: alert.productId }).sort({ date: -1 });
      if (!latest || latest.stores.length === 0) continue;

      const currentPrice = Math.min(...latest.stores.map((s) => s.price));

      if (currentPrice <= alert.targetPrice) {
        const user = await User.findById(alert.userId);
        if (!user) continue;

        try {
          await sendPriceDropEmail({
            to: user.email,
            title: alert.title || "A product you're tracking",
            targetPrice: alert.targetPrice,
            currentPrice,
            url: alert.url,
            image: alert.image,
          });
          alert.triggered = true;
          alert.lastSeenPrice = currentPrice;
          await alert.save();
          console.log(`[alerts] Sent price drop email to ${user.email} for "${alert.title}"`);
        } catch (err) {
          console.error("[alerts] Failed to send price drop email:", err.message);
        }
      } else if (alert.lastSeenPrice !== currentPrice) {
        alert.lastSeenPrice = currentPrice;
        await alert.save();
      }
    }
  } catch (err) {
    console.error("[alerts] Error checking alerts:", err.message);
  }
}

export function startAlertChecker() {
  checkAlerts();
  setInterval(checkAlerts, CHECK_INTERVAL_MS);
  console.log(`[alerts] Alert checker started (interval: ${CHECK_INTERVAL_MS / 60000}min)`);
}
