import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ScanningOverlay from "../components/scanning/ScanningOverlay";
import FocusCard from "../components/product/FocusCard";
import { searchProducts, getAlerts } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { SCAN_SEQUENCE } from "../utils/mockData";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "discount", label: "Highest Discount" },
];

function bestPrice(product) {
  return Math.min(...product.stores.map((s) => s.price));
}

function bestDiscount(product) {
  const original = Math.max(...product.stores.map((s) => s.originalPrice ?? 0));
  const best = bestPrice(product);
  return original > 0 ? (original - best) / original : 0;
}

function Results() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { isAuthenticated } = useAuth();

  const [animationDone, setAnimationDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("relevance");
  const [alertsByProduct, setAlertsByProduct] = useState({});

  // Live scraping can take a while — keep the scanning overlay up until
  // BOTH the intro animation has played AND real results have arrived, so
  // we never flash "No results found" before the data shows up.
  const scanning = !animationDone || !dataLoaded;

  useEffect(() => {
    setAnimationDone(false);
    setDataLoaded(false);
    setProducts([]);
    setError(null);
    searchProducts(query)
      .then((results) => {
        setProducts(results);
        setDataLoaded(true);
      })
      .catch((err) => {
        setError(err.message);
        setDataLoaded(true);
      });
  }, [query]);

  useEffect(() => {
    if (!isAuthenticated) {
      setAlertsByProduct({});
      return;
    }
    getAlerts()
      .then((alerts) => {
        setAlertsByProduct(Object.fromEntries(alerts.map((a) => [a.productId, a])));
      })
      .catch(() => setAlertsByProduct({}));
  }, [isAuthenticated]);

  const handleAlertChange = (alert, removedProductId) => {
    setAlertsByProduct((prev) => {
      const next = { ...prev };
      if (alert) {
        next[alert.productId] = alert;
      } else if (removedProductId) {
        delete next[removedProductId];
      }
      return next;
    });
  };

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "price-asc") list.sort((a, b) => bestPrice(a) - bestPrice(b));
    if (sort === "discount") list.sort((a, b) => bestDiscount(b) - bestDiscount(a));
    return list;
  }, [products, sort]);

  if (scanning) {
    return (
      <ScanningOverlay
        query={query}
        sequence={SCAN_SEQUENCE}
        onComplete={() => setAnimationDone(true)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showSearch />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-semibold">
              Results for "{query}"
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {sorted.length} product{sorted.length !== 1 ? "s" : ""} synced across stores
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="sort" className="text-text-secondary">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full bg-bg-surface border border-border-subtle px-3 py-1.5 text-text-primary outline-none focus:border-accent-primary cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 text-text-secondary">
            <SearchX className="w-10 h-10 mb-3" />
            <p className="font-medium text-text-primary mb-1">
              {error ? "Couldn't load results" : "No results found"}
            </p>
            <p className="text-sm">
              {error
                ? "There was a problem reaching the server. Please try again."
                : "Try searching for something else."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((product) => (
              <FocusCard
                key={product.id}
                product={product}
                activeAlert={alertsByProduct[product.id]}
                onAlertChange={handleAlertChange}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Results;
