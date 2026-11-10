import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SearchBar({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  function submitSearch(event) {
    event.preventDefault();
    const clean = query.trim();
    if (!clean) {
      navigate("/destinations");
      return;
    }
    navigate(`/destinations?search=${encodeURIComponent(clean)}`);
  }

  return (
    <form className="relative w-full max-w-xl" onSubmit={submitSearch} role="search">
      <label className="sr-only" htmlFor="destination-search">
        Search destinations
      </label>
      <input
        aria-label="Search destinations"
        className="w-full rounded-full border border-teal/20 bg-white/95 py-3.5 pl-12 pr-28 text-sm text-ink shadow-[0_12px_32px_rgba(15,92,94,0.08)] outline-none transition-all placeholder:text-muted/70 focus:border-teal focus:ring-4 focus:ring-teal/10"
        id="destination-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search destinations, moods, or regions..."
        type="search"
        value={query}
      />
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        size={18}
      />
      <button
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-teal px-5 py-2 text-xs font-semibold uppercase tracking-wider text-cream shadow-sm transition-all hover:bg-teal-hover focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
        type="submit"
      >
        Search
      </button>
    </form>
  );
}
