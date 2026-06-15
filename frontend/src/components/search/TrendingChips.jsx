const TRENDING_SEARCHES = [
  "iPhone 15",
  "Nike Air Max",
  "Boat Headphones",
  "Samsung Smart TV",
  "Levi's Jeans",
  "PS5 Controller",
];

function TrendingChips({ onSelect }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
      <span className="flex items-center gap-1.5 text-text-secondary text-sm mr-1">
        <span aria-hidden>🔥</span>
        Trending:
      </span>
      {TRENDING_SEARCHES.map((term) => (
        <button
          key={term}
          onClick={() => onSelect?.(term)}
          className="px-3.5 py-1.5 rounded-full text-sm bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent-primary/50 hover:bg-bg-surface-hover transition-all duration-200 cursor-pointer"
        >
          {term}
        </button>
      ))}
    </div>
  );
}

export default TrendingChips;
