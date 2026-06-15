import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import ScanStatusItem from "./ScanStatusItem";
import SkeletonCard from "./SkeletonCard";

// sequence: [{ store: "Amazon", duration: 900, resultCount: 12 }, ...]
function ScanningOverlay({ query, sequence, onComplete }) {
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    setDoneCount(0);
    const timers = [];
    let elapsed = 0;

    sequence.forEach((step, i) => {
      elapsed += step.duration;
      timers.push(
        setTimeout(() => {
          setDoneCount(i + 1);
        }, elapsed)
      );
    });

    timers.push(setTimeout(() => onComplete?.(), elapsed + 400));

    return () => timers.forEach(clearTimeout);
  }, [sequence, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-bg-base flex flex-col items-center px-4 sm:px-6 pt-20 pb-8 overflow-y-auto">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(124,92,252,0.15), transparent 50%)",
        }}
      />

      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary shadow-lg shadow-accent-primary/30 animate-pulse-slow mb-6">
        <Zap className="w-8 h-8 text-bg-base" strokeWidth={2.5} fill="currentColor" />
      </div>

      <h2 className="text-xl sm:text-2xl font-display font-semibold text-center">
        Syncing prices for "{query}"
      </h2>
      <p className="text-text-secondary text-sm mt-1 mb-8 text-center">
        Hang tight — we're checking every store for the best deal.
      </p>

      <div className="w-full max-w-md flex flex-col gap-2 mb-10">
        {sequence.map((step, i) => (
          <ScanStatusItem
            key={step.store}
            store={step.store}
            status={i < doneCount ? "done" : i === doneCount ? "scanning" : "pending"}
            resultCount={step.resultCount}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export default ScanningOverlay;
