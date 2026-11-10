import { ArrowUpRight, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

export function ImageCard({ destination, className = "" }) {
  const { slug, name, state, image, price, duration, label, rating, highlights } = destination;
  const { isSaved, toggleWishlist } = useWishlist();
  const saved = isSaved(slug);
  const isFeatured = className.includes("destination-tile-featured");

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-sand/70 bg-white shadow-[0_4px_24px_rgba(15,92,94,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(15,92,94,0.12)] ${className}`}
    >
      <Link
        aria-label={`View journey: ${name}, ${state}`}
        className={`relative w-full overflow-hidden bg-sand/30 ${
          isFeatured ? "flex-1 min-h-[360px]" : "aspect-[4/3]"
        }`}
        to={`/destinations/${slug}`}
      >
        <img
          alt={`${name} — ${state}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          src={image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-black/25" />

        {/* Badges */}
        <div className="absolute left-3.5 top-3.5 flex flex-wrap items-center gap-1.5">
          {label && (
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold tracking-wide text-teal shadow-sm backdrop-blur-md">
              {label}
            </span>
          )}
          {isFeatured && (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-deep shadow-sm">
              Featured Yatra
            </span>
          )}
        </div>

        <div className="absolute bottom-3.5 left-3.5 right-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-warm">{state}</p>
          <h3 className="font-serif text-2xl font-normal text-cream">{name}</h3>

          {/* Highlights for featured card */}
          {isFeatured && highlights && highlights.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {highlights.slice(0, 3).map((h) => (
                <span
                  key={h}
                  className="rounded-full border border-white/20 bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-cream backdrop-blur-md"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Floating Bookmark Button */}
      <button
        aria-label={saved ? `Remove ${name} from saved wishlist` : `Save ${name} to wishlist`}
        className={`absolute right-3.5 top-3.5 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform duration-200 hover:scale-110 ${
          saved
            ? "bg-white text-rose-500 shadow-md"
            : "bg-ink/50 text-white hover:bg-ink/75"
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(slug);
        }}
        title={saved ? "Saved" : "Save trip"}
        type="button"
      >
        <Heart className={saved ? "fill-rose-500 text-rose-500" : "text-white"} size={16} />
      </button>

      <div className="flex shrink-0 items-center justify-between border-t border-sand/40 bg-white p-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Starting at</span>
          <p className="font-serif text-lg font-semibold text-ink">{price}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted">{duration}</span>
          <Link
            className="flex items-center justify-end gap-1 text-xs font-semibold text-teal hover:text-teal-hover"
            to={`/destinations/${slug}`}
          >
            <span>View trip</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
