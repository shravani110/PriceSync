import { CheckCircle2, LoaderCircle, Circle } from "lucide-react";
import { getStoreMeta } from "../../utils/stores";

// status: "pending" | "scanning" | "done"
function ScanStatusItem({ store, status, resultCount }) {
  const meta = getStoreMeta(store);

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-all duration-300 ${
        status === "pending"
          ? "border-border-subtle bg-bg-surface/50 opacity-50"
          : status === "scanning"
            ? "border-accent-primary/40 bg-accent-primary/5"
            : "border-success/30 bg-success/5"
      }`}
    >
      <span
        className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold shrink-0"
        style={{ backgroundColor: meta.color, color: meta.textColor }}
      >
        {meta.initial}
      </span>

      <span className="flex-1 text-sm font-medium text-text-primary text-left">
        {status === "scanning" && `Scanning ${store}...`}
        {status === "done" && `Scanned ${store}`}
        {status === "pending" && `Waiting for ${store}...`}
      </span>

      {status === "done" && resultCount != null && (
        <span className="text-xs text-text-secondary">{resultCount} results</span>
      )}

      {status === "pending" && <Circle className="w-4 h-4 text-text-secondary shrink-0" />}
      {status === "scanning" && (
        <LoaderCircle className="w-4 h-4 text-accent-primary animate-spin shrink-0" />
      )}
      {status === "done" && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
    </div>
  );
}

export default ScanStatusItem;
