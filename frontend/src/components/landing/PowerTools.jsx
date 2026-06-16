import { Bell, History, Share2 } from "lucide-react";

function PriceChart() {
  return (
    <svg
      viewBox="0 0 400 160"
      className="w-full h-32 sm:h-40"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-secondary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="chart-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-accent-primary)" />
          <stop offset="100%" stopColor="var(--color-accent-secondary)" />
        </linearGradient>
      </defs>
      <path
        d="M0,110 L40,95 L80,120 L120,80 L160,90 L200,55 L240,70 L280,40 L320,55 L360,25 L400,35 L400,160 L0,160 Z"
        fill="url(#chart-fill)"
      />
      <path
        d="M0,110 L40,95 L80,120 L120,80 L160,90 L200,55 L240,70 L280,40 L320,55 L360,25 L400,35"
        fill="none"
        stroke="url(#chart-line)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PowerTools() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div className="max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-display font-semibold mb-2">
            Power Tools for Savvy Shoppers
          </h2>
          <p className="text-text-secondary text-sm sm:text-base">
            Stop leaving money on the table. PriceSync gives you the
            professional edge in every transaction.
          </p>
        </div>
        <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-accent-secondary/15 text-accent-secondary whitespace-nowrap">
          Syncing across 7 top retailers
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-bg-surface border border-border-subtle p-6 flex flex-col">
          <PriceChart />
          <h3 className="font-display font-semibold text-lg mt-4 mb-1">
            Live Price Comparison
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Every search fetches live prices directly from Amazon, Flipkart,
            Myntra, AJIO, Croma, Reliance Digital and Vijay Sales — all at once.
          </p>
        </div>

        <div className="rounded-2xl bg-bg-surface border border-border-subtle p-6 flex flex-col">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4 bg-accent-primary/15 text-accent-primary">
            <Bell className="w-5 h-5" />
          </span>
          <h3 className="font-display font-semibold text-lg mb-1">Price Drop Alerts</h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Set your target price and walk away. We'll notify you the
            second it hits your sweet spot.
          </p>
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("hero-search-input");
              input?.scrollIntoView({ behavior: "smooth", block: "center" });
              input?.focus();
            }}
            className="mt-auto text-sm font-medium text-accent-secondary hover:text-accent-primary transition-colors text-left cursor-pointer"
          >
            Set an alert now →
          </button>
        </div>

        <div className="rounded-2xl bg-bg-surface border border-border-subtle p-6 flex flex-col">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4 bg-tag-trending/15 text-tag-trending">
            <History className="w-5 h-5" />
          </span>
          <h3 className="font-display font-semibold text-lg mb-1">Price History</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            See if that "Limited Time Deal" is actually a bargain or just the
            usual price dressed up in red.
          </p>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-bg-surface border border-border-subtle p-6 flex flex-col">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4 bg-accent-secondary/15 text-accent-secondary">
            <Share2 className="w-5 h-5" />
          </span>
          <h3 className="font-display font-semibold text-lg mb-1">7 Top Indian Stores</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Amazon, Flipkart, Myntra, AJIO, Croma, Reliance Digital and Vijay
            Sales — all compared side by side in a single search.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PowerTools;
