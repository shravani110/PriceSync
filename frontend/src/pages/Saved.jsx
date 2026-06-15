import { useEffect, useState } from "react";
import { Heart, Bell, BellRing, X } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import FocusCard from "../components/product/FocusCard";
import { getSavedItems } from "../utils/savedItems";
import { getAlerts, clearProductAlert } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/formatPrice";

function AlertsSection() {
  const { isAuthenticated } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    getAlerts()
      .then(setAlerts)
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated || loading || alerts.length === 0) return null;

  const handleRemove = async (productId) => {
    await clearProductAlert(productId);
    setAlerts((prev) => prev.filter((a) => a.productId !== productId));
  };

  return (
    <section className="mb-10">
      <h2 className="text-lg font-display font-semibold mb-1">Price Alerts</h2>
      <p className="text-text-secondary text-sm mb-4">
        We'll email you the moment any of these drop to your target price.
      </p>
      <div className="flex flex-col gap-2">
        {alerts.map((alert) => (
          <div
            key={alert.productId}
            className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-surface p-3"
          >
            {alert.image && (
              <img
                src={alert.image}
                alt={alert.title}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{alert.title}</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Target: <span className="text-accent-secondary font-medium">{formatPrice(alert.targetPrice)}</span>
                {alert.lastSeenPrice != null && (
                  <> · Last seen: {formatPrice(alert.lastSeenPrice)}</>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {alert.triggered ? (
                <span className="flex items-center gap-1 text-xs font-medium text-success">
                  <BellRing className="w-3.5 h-3.5" />
                  Notified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-text-secondary">
                  <Bell className="w-3.5 h-3.5" />
                  Watching
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(alert.productId)}
                aria-label="Remove alert"
                className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Saved() {
  const [items, setItems] = useState(() => getSavedItems());

  const handleUnsave = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AlertsSection />

        <h1 className="text-xl sm:text-2xl font-display font-semibold">Saved Products</h1>
        <p className="text-text-secondary text-sm mt-1 mb-6">
          {items.length} product{items.length !== 1 ? "s" : ""} in your wishlist
        </p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 text-text-secondary">
            <Heart className="w-10 h-10 mb-3" />
            <p className="font-medium text-text-primary mb-1">No saved products yet</p>
            <p className="text-sm">
              Tap the bookmark icon on any product to add it to your wishlist.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((product) => (
              <FocusCard key={product.id} product={product} onUnsave={handleUnsave} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Saved;
