import { ArrowUpRight } from "lucide-react";
import { getStoreMeta } from "../../utils/stores";
import { formatPrice } from "../../utils/formatPrice";

function StorePriceRow({ stores }) {
  const sorted = [...stores].sort((a, b) => a.price - b.price);
  const lowest = sorted[0]?.price;

  return (
    <div className="flex flex-col rounded-xl border border-border-subtle divide-y divide-border-subtle overflow-hidden">
      {sorted.map((store) => {
        const meta = getStoreMeta(store.name);
        const isBest = store.price === lowest;

        return (
          <a
            key={store.name}
            href={store.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`group/row flex items-center justify-between gap-2 px-3 py-2 transition-colors duration-150 ${
              isBest ? "bg-accent-secondary/10" : "hover:bg-bg-surface-hover"
            }`}
          >
            <span className="flex items-center gap-2 min-w-0">
              <span
                className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0"
                style={{ backgroundColor: meta.color, color: meta.textColor }}
              >
                {meta.initial}
              </span>
              <span className="text-xs text-text-secondary truncate">{store.name}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <span
                className={`text-sm font-semibold ${
                  isBest ? "text-accent-secondary" : "text-text-primary"
                }`}
              >
                {formatPrice(store.price)}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-text-secondary opacity-0 group-hover/row:opacity-100 transition-opacity" />
            </span>
          </a>
        );
      })}
    </div>
  );
}

export default StorePriceRow;
