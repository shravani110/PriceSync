import { useState } from "react";
import { Search } from "lucide-react";

function SearchBar({ onSearch, compact = false, initialValue = "", id }) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`group relative flex items-center w-full rounded-full bg-bg-surface border border-border-subtle transition-all duration-300 focus-within:border-accent-primary focus-within:shadow-[0_0_0_4px_rgba(124,92,252,0.15)] ${
        compact ? "h-11" : "h-14"
      }`}
    >
      <Search
        className={`text-text-secondary group-focus-within:text-accent-primary transition-colors ${
          compact ? "w-4 h-4 ml-4" : "w-5 h-5 ml-5"
        }`}
      />
      <input
        id={id}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a product e.g. Nike Air Max"
        className={`flex-1 bg-transparent outline-none placeholder:text-text-secondary text-text-primary ${
          compact ? "px-3 text-sm" : "px-4 text-base"
        }`}
      />
      <button
        type="submit"
        className={`mr-1.5 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-bg-base font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-accent-primary/30 active:scale-[0.97] cursor-pointer ${
          compact ? "px-4 py-1.5 text-sm" : "px-6 py-2.5 text-sm"
        }`}
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
