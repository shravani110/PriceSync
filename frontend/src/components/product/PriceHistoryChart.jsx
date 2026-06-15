import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown } from "lucide-react";
import { getPriceHistory } from "../../services/api";
import { formatPrice } from "../../utils/formatPrice";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { date, price } = payload[0].payload;

  return (
    <div className="rounded-lg bg-bg-base border border-border-subtle px-3 py-2 text-xs shadow-xl">
      <p className="text-text-secondary mb-0.5">{formatDate(date)}</p>
      <p className="font-semibold text-text-primary">{formatPrice(price)}</p>
    </div>
  );
}

function PriceHistoryChart({ productId }) {
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPriceHistory(productId)
      .then((data) => !cancelled && setHistory(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (error) return null;

  if (!history) {
    return <div className="h-32 animate-pulse rounded-xl bg-bg-base/40" />;
  }

  const points = history.map((entry) => ({
    date: entry.date,
    price: Math.min(...entry.stores.map((s) => s.price)),
  }));

  if (points.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center gap-1.5 h-32 rounded-xl bg-bg-base/40 text-center px-4">
        <TrendingDown className="w-4 h-4 text-text-secondary" />
        <p className="text-xs text-text-secondary">
          We just started tracking this product — check back soon to see price trends.
        </p>
      </div>
    );
  }

  return (
    <div className="h-32 -mx-1">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="priceHistoryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent-secondary)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: "var(--color-text-secondary)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            minTickGap={20}
          />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--color-accent-secondary)"
            strokeWidth={2}
            fill="url(#priceHistoryGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriceHistoryChart;
