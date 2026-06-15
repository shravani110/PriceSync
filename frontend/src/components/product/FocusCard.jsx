import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ArrowUpRight, Heart, Bell, BellRing, X, History, ChevronDown } from "lucide-react";
import { useDominantColor } from "../../hooks/useDominantColor";
import { formatPrice, discountPercent } from "../../utils/formatPrice";
import { isSaved, toggleSaved } from "../../utils/savedItems";
import { setProductAlert, clearProductAlert } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import SmartTagBadge from "./SmartTagBadge";
import StorePriceRow from "./StorePriceRow";
import PriceHistoryChart from "./PriceHistoryChart";

function FocusCard({ product, onUnsave, activeAlert, onAlertChange }) {
  const glow = useDominantColor(product.image);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [saved, setSavedState] = useState(() => isSaved(product.id));
  const [alertPrice, setAlertPrice] = useState(() => activeAlert?.targetPrice ?? null);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [alertInput, setAlertInput] = useState("");
  const [alertError, setAlertError] = useState("");
  const [alertSubmitting, setAlertSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const sortedStores = [...product.stores].sort((a, b) => a.price - b.price);
  const best = sortedStores[0];
  const originalPrice = Math.max(...product.stores.map((s) => s.originalPrice ?? 0));
  const discount = discountPercent(originalPrice, best.price);

  const handleToggleSaved = () => {
    const nowSaved = toggleSaved(product);
    setSavedState(nowSaved);
    if (!nowSaved) onUnsave?.(product.id);
  };

  const handleAlertButtonClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowAlertForm((v) => !v);
  };

  const handleSetAlert = async (e) => {
    e.preventDefault();
    const value = Number(alertInput);
    if (!(value > 0)) return;

    setAlertSubmitting(true);
    setAlertError("");
    try {
      const alert = await setProductAlert({
        productId: product.id,
        title: product.title,
        image: product.image,
        url: best.url,
        targetPrice: value,
        currentPrice: best.price,
      });
      setAlertPrice(alert.targetPrice);
      setShowAlertForm(false);
      onAlertChange?.(alert);
    } catch (err) {
      setAlertError(err.message);
    } finally {
      setAlertSubmitting(false);
    }
  };

  const handleClearAlert = async () => {
    try {
      await clearProductAlert(product.id);
    } catch {
      // already removed or expired session — clear local state regardless
    }
    setAlertPrice(null);
    setAlertInput("");
    setShowAlertForm(false);
    onAlertChange?.(null, product.id);
  };

  return (
    <div
      className="group relative rounded-2xl border border-border-subtle bg-bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(var(--glow),0.4)]"
      style={{ "--glow": glow }}
    >
      {/* Dynamic color glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{
          background: `radial-gradient(circle at 50% 30%, rgba(${glow}, 0.6), transparent 70%)`,
        }}
      />

      <div className="relative">
        {/* Tags */}
        {product.tags?.length > 0 && (
          <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <SmartTagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Save & price-alert actions */}
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleSaved}
            aria-label={saved ? "Remove from saved" : "Save product"}
            className={`flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md border border-border-subtle transition-colors cursor-pointer ${
              saved
                ? "bg-accent-primary text-bg-base"
                : "bg-bg-base/60 text-text-secondary hover:text-text-primary"
            }`}
          >
            <Heart className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={handleAlertButtonClick}
              aria-label="Set price alert"
              className={`flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md border border-border-subtle transition-colors cursor-pointer ${
                alertPrice
                  ? "bg-accent-secondary text-bg-base"
                  : "bg-bg-base/60 text-text-secondary hover:text-text-primary"
              }`}
            >
              {alertPrice ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            </button>

            {showAlertForm && (
              <div className="absolute top-10 right-0 z-30 w-48 rounded-xl bg-bg-surface border border-border-subtle p-3 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-text-primary">Alert me below</span>
                  <button
                    type="button"
                    onClick={() => setShowAlertForm(false)}
                    className="text-text-secondary hover:text-text-primary cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <form onSubmit={handleSetAlert} className="flex flex-col gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder={`e.g. ${Math.round(best.price * 0.9)}`}
                    value={alertInput}
                    onChange={(e) => setAlertInput(e.target.value)}
                    className="w-full rounded-lg bg-bg-base border border-border-subtle px-2.5 py-1.5 text-sm outline-none focus:border-accent-primary text-text-primary"
                  />
                  {alertError && <p className="text-[11px] text-red-400">{alertError}</p>}
                  <button
                    type="submit"
                    disabled={alertSubmitting}
                    className="rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary text-bg-base text-xs font-semibold py-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {alertSubmitting ? "Saving..." : "Set Alert"}
                  </button>
                  {alertPrice && (
                    <button
                      type="button"
                      onClick={handleClearAlert}
                      className="text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    >
                      Remove alert ({formatPrice(alertPrice)})
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-bg-base/40 mb-4">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Title */}
        <h3 className="font-medium text-sm leading-snug line-clamp-2 mb-1.5 min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-3">
          <Star className="w-3.5 h-3.5 fill-tag-trending text-tag-trending" />
          <span className="font-medium text-text-primary">{product.rating}</span>
          <span>({product.reviews.toLocaleString("en-IN")})</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase tracking-wide text-text-secondary font-medium">
              Lowest Price
            </span>
            {discount > 0 ? (
              <span className="text-xs font-semibold text-success">{discount}% drop</span>
            ) : (
              <span className="text-xs font-medium text-text-secondary">Price stable</span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-display font-semibold text-text-primary">
              {formatPrice(best.price)}
            </span>
            {originalPrice > best.price && (
              <span className="text-sm text-text-secondary line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Price history */}
        <button
          type="button"
          onClick={() => setShowHistory((v) => !v)}
          className="w-full flex items-center justify-between gap-2 text-xs text-text-secondary hover:text-text-primary transition-colors mb-3 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            Price History
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${showHistory ? "rotate-180" : ""}`}
          />
        </button>
        {showHistory && (
          <div className="mb-3">
            <PriceHistoryChart productId={product.id} />
          </div>
        )}

        {/* Store comparison list */}
        <StorePriceRow stores={product.stores} />

        {/* CTA */}
        <a
          href={best.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-bg-base font-semibold text-sm py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-accent-primary/30 active:scale-[0.98]"
        >
          View Deal on {best.name}
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export default FocusCard;
