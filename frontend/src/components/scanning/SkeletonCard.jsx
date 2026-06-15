function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-surface p-4">
      <div className="aspect-square w-full rounded-xl bg-bg-surface-hover overflow-hidden mb-4 relative">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="h-3.5 rounded bg-bg-surface-hover overflow-hidden relative mb-2">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="h-3.5 w-2/3 rounded bg-bg-surface-hover overflow-hidden relative mb-4">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="h-6 w-1/2 rounded bg-bg-surface-hover overflow-hidden relative mb-4">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-10 w-20 rounded-xl bg-bg-surface-hover overflow-hidden relative">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonCard;
