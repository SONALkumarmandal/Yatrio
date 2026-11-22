import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Compass,
  MapPin,
  MessageCircle,
  Search,
  Star,
} from "lucide-react";
import { Eyebrow } from "../components/ui/Eyebrow";
import * as destinationsApi from "../services/destinationsApi";
import { whatsappUrl } from "../data/destinations";

function DestinationCard({ destination }) {
  return (
    <Link className="destination-card group" to={`/destinations/${destination.slug}`}>
      <div className="destination-card-photo">
        <img
          alt={`${destination.name}, ${destination.state}`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]"
          loading="lazy"
          src={destination.image}
        />
        <span className="absolute left-3 top-3 rounded-full border border-white/45 bg-white/90 px-3 py-1 text-[0.67rem] font-semibold uppercase tracking-[0.1em] text-teal backdrop-blur">
          {destination.region}
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 text-teal">
          <ArrowUpRight size={17} />
        </span>
      </div>
      <div className="flex items-start justify-between gap-3 px-1 pt-4">
        <div>
          <h2 className="font-display text-[1.4rem] font-semibold leading-tight text-ink">
            {destination.name}
          </h2>
          <p className="mt-1 text-sm text-muted">{destination.state}</p>
        </div>
        <span className="mt-1 flex items-center gap-1 text-sm font-medium text-ink">
          <Star className="fill-gold text-gold" size={14} /> {destination.rating}
        </span>
      </div>
      <div className="flex items-center justify-between px-1 pb-1 pt-3">
        <span className="text-xs text-muted">{destination.duration}</span>
        <span className="text-sm font-semibold text-teal">from {destination.price}</span>
      </div>
    </Link>
  );
}

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || searchParams.get("q") || "";
  const initialRegion = searchParams.get("region") || "All regions";

  const [query, setQuery] = useState(initialSearch);
  const [region, setRegion] = useState(initialRegion);
  const [regionsList, setRegionsList] = useState(["All regions", "North", "South", "West", "East", "Islands", "Beyond"]);
  const [budget, setBudget] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  // Load regions on mount
  useEffect(() => {
    async function loadRegions() {
      const reg = await destinationsApi.getRegions();
      if (reg && reg.length > 0) {
        setRegionsList(reg);
      }
    }
    loadRegions();
  }, []);

  // Fetch destinations when search or region changes
  useEffect(() => {
    async function fetchList() {
      setLoading(true);
      try {
        const res = await destinationsApi.getDestinations({
          search: query,
          region: region !== "All regions" ? region : "",
        });
        if (res?.items) {
          setDestinations(res.items);
          setFromApi(res.fromApi);
        }
      } catch (err) {
        console.error("Failed to load destinations:", err);
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(fetchList, 250);
    return () => clearTimeout(timer);
  }, [query, region]);

  // Client-side budget filter
  const filtered = destinations.filter((dest) => {
    if (!budget) return true;
    const amount = dest.rawPrice || Number(dest.price.replace(/[^\d]/g, "")) || 0;
    return budget === "under" ? amount < 25000 : amount >= 25000;
  });

  const filterCount = Number(region !== "All regions") + Number(Boolean(budget));

  const clearFilters = () => {
    setQuery("");
    setRegion("All regions");
    setBudget("");
    setSearchParams({});
  };

  return (
    <div>
      <section className="explore-intro">
        <div className="mx-auto max-w-[1240px] px-5 pt-5 sm:px-8 sm:pt-7 lg:pt-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <Link className="transition hover:text-teal" to="/">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-teal">Destinations</span>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2.5">
                <Eyebrow>Destinations</Eyebrow>
                {fromApi && (
                  <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal">
                    Live Catalog
                  </span>
                )}
              </div>
              <h1 className="mt-1.5 font-display text-[2.1rem] font-semibold leading-tight tracking-[-0.035em] text-teal sm:text-[2.65rem]">
                Where to next?
              </h1>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                For the long weekends, the slow escapes, and the holidays you haven’t quite dreamed up yet.
              </p>
            </div>
            <span className="mb-0.5 inline-flex items-center gap-2 text-xs text-muted sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-[#16836e]" />
              {destinations.length} thoughtfully picked places
            </span>
          </div>

          <div className="mt-4 max-w-2xl">
            <label className="search-bar search-bar-light">
              <MapPin className="shrink-0 text-teal" size={17} />
              <span className="sr-only">Search places, regions, or experiences</span>
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a place, region, or feeling..."
                type="search"
                value={query}
              />
              <Search className="hidden text-teal sm:block" size={17} />
            </label>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pb-4 sm:pb-5">
            {regionsList.map((item) => (
              <button
                aria-pressed={region === item}
                className={`filter-chip ${region === item ? "filter-chip-active" : ""}`}
                key={item}
                onClick={() => setRegion(item)}
                type="button"
              >
                {item}
              </button>
            ))}
            <button
              aria-expanded={filtersOpen}
              className={`filter-chip ml-0 inline-flex items-center gap-1.5 sm:ml-auto ${
                filtersOpen ? "border-teal text-teal" : ""
              }`}
              onClick={() => setFiltersOpen((open) => !open)}
              type="button"
            >
              Filters {filterCount > 0 && <span className="filter-count">{filterCount}</span>}
              <ChevronDown className={`transition ${filtersOpen ? "rotate-180" : ""}`} size={13} />
            </button>
          </div>

          {filtersOpen && (
            <div className="border-t border-sand pb-4 pt-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">A little about your budget</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  ["under", "Under ₹25k"],
                  ["over", "₹25k & above"],
                ].map(([value, label]) => (
                  <button
                    aria-pressed={budget === value}
                    className={`filter-chip ${budget === value ? "filter-chip-active" : ""}`}
                    key={value}
                    onClick={() => setBudget((current) => (current === value ? "" : value))}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
                {filterCount > 0 && (
                  <button
                    className="px-2.5 py-1 text-xs font-semibold text-teal underline underline-offset-4"
                    onClick={clearFilters}
                    type="button"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-6 sm:px-8 sm:py-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p aria-live="polite" className="text-sm text-muted">
            {loading ? "Discovering places..." : `${filtered.length} ${filtered.length === 1 ? "place" : "places"} to fall for`}
          </p>
          <span className="hidden text-xs text-muted sm:block">Good things take the scenic route.</span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((destination) => (
              <DestinationCard destination={destination} key={destination.slug || destination.id} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-sand bg-white/55 px-6 text-center">
            <Compass className="text-teal/55" size={32} strokeWidth={1.5} />
            <h2 className="mt-4 font-display text-2xl font-semibold text-teal">Nothing quite like that (yet).</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
              Try a different search, or tell our planner on WhatsApp what you are dreaming of.
            </p>
            <button className="button-teal mt-5 px-5" onClick={clearFilters} type="button">
              See all destinations
            </button>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1240px] px-5 pb-12 sm:px-8 sm:pb-14">
        <div className="planner-card">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gold">
              <MessageCircle size={19} />
            </span>
            <h2 className="mt-4 font-display text-[1.75rem] font-semibold leading-tight text-white sm:text-3xl">
              Can’t decide where to go?
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Tell us what you’re in the mood for. We know someone who knows a place.
            </p>
            <a
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-deep transition hover:bg-[#ffd07e]"
              href={whatsappUrl("Hi Yatrio, help me find a destination for my next trip.")}
              rel="noreferrer"
              target="_blank"
            >
              Talk to a real planner <ArrowRight size={16} />
            </a>
          </div>
          <div aria-hidden="true" className="planner-decoration">
            <Compass size={185} strokeWidth={0.65} />
          </div>
        </div>
      </section>
    </div>
  );
}
