import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  Compass,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Eyebrow } from "../components/ui/Eyebrow";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ImageCard } from "../components/ui/ImageCard";
import { useWishlist } from "../context/WishlistContext";
import * as destinationsApi from "../services/destinationsApi";
import { whatsappUrl } from "../data/destinations";

export function DestinationDetailPage() {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const { isSaved, toggleWishlist } = useWishlist();
  const saved = isSaved(slug);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      try {
        const dest = await destinationsApi.getDestinationBySlug(slug);
        setDestination(dest);

        const all = await destinationsApi.getDestinations({ pageSize: 4 });
        if (all?.items) {
          setRelated(all.items.filter((item) => item.slug !== slug).slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load destination detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: `${destination.name} with Yatreo`,
        text: destination.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <Compass className="animate-spin text-teal/40" size={36} />
        <p className="mt-4 text-sm font-medium text-muted">Discovering journey details...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <Compass className="text-teal/55" size={34} />
        <h1 className="mt-4 font-display text-3xl font-semibold text-teal">That way’s still a mystery.</h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">
          We haven’t added this destination just yet, but there are plenty of other lovely places.
        </p>
        <Link className="button-teal mt-5 px-5" to="/destinations">
          Explore all destinations
        </Link>
      </main>
    );
  }

  return (
    <div>
      {/* Hero Visual */}
      <section className="destination-hero">
        <img
          alt={`${destination.name}, ${destination.state}`}
          className="destination-hero-image"
          fetchPriority="high"
          src={destination.image}
        />
        <div className="destination-hero-shade" />

        {/* Top Right Save & Share */}
        <div className="absolute right-6 top-6 z-20 flex items-center gap-2">
          <button
            aria-label={saved ? "Remove from wishlist" : "Save destination"}
            className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-110 ${
              saved ? "bg-white text-rose-500 shadow-md" : "bg-black/40 text-white hover:bg-black/60"
            }`}
            onClick={() => toggleWishlist(slug)}
            type="button"
          >
            <Heart className={saved ? "fill-rose-500" : ""} size={18} />
          </button>

          <button
            aria-label="Share trip link"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
            onClick={handleShare}
            type="button"
          >
            {copied ? <CheckCircle2 className="text-emerald-400" size={18} /> : <Share2 size={18} />}
          </button>
        </div>

        <div className="destination-hero-content">
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/75">
            <Link className="transition hover:text-gold" to="/">
              Home
            </Link>
            <span>/</span>
            <Link className="transition hover:text-gold" to="/destinations">
              Destinations
            </Link>
            <span>/</span>
            <span className="font-medium text-white">{destination.name}</span>
          </div>

          <span className="mt-9 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.13em] text-white backdrop-blur">
            <MapPin size={14} /> {destination.region} {destination.country || "India"}
          </span>

          <h1 className="mt-5 font-display text-[3.5rem] font-semibold leading-[0.99] tracking-[-0.05em] text-white sm:text-[5.5rem]">
            {destination.name}
          </h1>
          <p className="mt-3 font-display text-xl italic text-white/85 sm:text-[1.65rem]">{destination.state}</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">{destination.description}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              className="button-gold min-h-[48px] gap-2 px-6"
              href={whatsappUrl(`Hi Yatreo, I'd love to plan a trip to ${destination.name}.`)}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle size={17} /> Plan my {destination.name} trip
            </a>
            <a
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/40 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              href="#the-journey"
            >
              Explore the journey <ArrowDown size={16} />
            </a>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 hidden items-center gap-2 text-xs text-white/80 sm:flex">
          <Star className="fill-gold text-gold" size={15} /> Loved by travellers · {destination.rating}/5
        </div>
      </section>

      {/* Main Details */}
      <section className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 sm:py-16" id="the-journey">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.78fr] lg:gap-16">
          <div>
            <Eyebrow>A place to feel, not just see</Eyebrow>
            <h2 className="mt-3 max-w-2xl font-display text-[2.15rem] font-semibold leading-tight tracking-[-0.03em] text-teal sm:text-[3rem]">
              {destination.name}, at your own pace.
            </h2>
            <p className="mt-4 max-w-xl text-[0.94rem] leading-7 text-muted">
              {destination.description} We’ll help you find the right mix of much-loved classics and little local moments,
              without making every day feel like a checklist.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {destination.highlights.map((highlight) => (
                <span
                  className="inline-flex items-center gap-2 rounded-full bg-[#f2ede3] px-4 py-2 text-xs font-medium text-teal"
                  key={highlight}
                >
                  <Check size={14} /> {highlight}
                </span>
              ))}
            </div>

            {/* Inclusions Card */}
            <div className="mt-8 rounded-2xl border border-sand bg-white p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-warm">Always Included in your Yatra</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs text-ink/80">
                <div className="flex items-center gap-2">
                  <Check className="text-teal" size={15} /> Verified boutique stays &amp; homestays
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-teal" size={15} /> Dedicated private sanitized cab &amp; driver
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-teal" size={15} /> Daily freshly prepared breakfasts
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-teal" size={15} /> 24/7 dedicated human WhatsApp concierge
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 self-start">
            <div className="rounded-2xl bg-[#f4ede1] p-5 sm:p-6">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-muted">Lovely time to go</span>
              <p className="mt-3 font-display text-lg font-semibold leading-snug text-teal">{destination.season}</p>
            </div>
            <div className="rounded-2xl bg-[#f4ede1] p-5 sm:p-6">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-muted">Make room for it</span>
              <p className="mt-3 font-display text-lg font-semibold leading-snug text-teal">{destination.duration}</p>
            </div>
            <div className="col-span-2 flex items-center justify-between rounded-2xl bg-teal p-5 text-white sm:p-6">
              <div>
                <span className="text-xs font-medium uppercase tracking-[0.1em] text-white/65">
                  Thoughtful trips from
                </span>
                <p className="mt-2 font-display text-2xl font-semibold">{destination.price}</p>
                <p className="mt-1 text-xs text-white/65">per person · tailored to your trip</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-gold">
                <Sparkles size={21} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Rhythm Strip */}
      <section className="section-tint py-12 sm:py-16">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHeading
            description={`Places, people, and unhurried moments that make a trip to ${destination.name} feel like yours.`}
            eyebrow={`The rhythm of ${destination.name}`}
            title="A few lovely places along the way."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {destination.highlights.map((highlight, index) => (
              <article className="experience-card" key={highlight}>
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 font-display text-lg text-teal">
                  0{index + 1}
                </span>
                <h3 className="font-display text-xl font-semibold text-ink">{highlight}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  There’s time to find the view, linger a little, and take the road locals would take.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Suggested Gen-Z Package Timeline */}
      <section className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8">
        <div className="rounded-3xl border border-sand bg-white p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal">
                <Sparkles className="text-gold" size={13} /> Suggested Package Flow · The Vibe Timeline
              </span>
              <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
                How your days flow in {destination.name}.
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-muted max-w-xl">
                Crafted for golden hours, main-character views, and zero stress. 100% tailor-made packages can be customized around your dates!
              </p>
            </div>
            <a
              className="button-gold self-start sm:self-auto gap-2 px-5 py-2.5 text-xs font-semibold whitespace-nowrap shadow-sm"
              href={whatsappUrl(`Hi Yatreo! I love the suggested timeline for ${destination.name}. Could we design a tailor-made package around it?`)}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle size={15} /> Customize This Timeline
            </a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-sand/60 bg-cream/30 p-4 transition hover:border-teal/30 hover:bg-white hover:shadow-xs">
              <span className="rounded bg-teal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-teal">Day 01</span>
              <h4 className="mt-2 font-display text-sm font-semibold text-ink">Touchdown &amp; Settle In ☕</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Scenic transit from airport / station, local welcome tea, and an unhurried sunset stroll to get in the groove.
              </p>
            </div>

            <div className="rounded-2xl border border-sand/60 bg-cream/30 p-4 transition hover:border-teal/30 hover:bg-white hover:shadow-xs">
              <span className="rounded bg-teal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-teal">Day 02–03</span>
              <h4 className="mt-2 font-display text-sm font-semibold text-ink">Main Character Views 📸</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Hidden viewpoints, private boat / cab diversions, and aesthetic local food crawls away from crowded tourist bus spots.
              </p>
            </div>

            <div className="rounded-2xl border border-sand/60 bg-cream/30 p-4 transition hover:border-teal/30 hover:bg-white hover:shadow-xs">
              <span className="rounded bg-teal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-teal">Day 04</span>
              <h4 className="mt-2 font-display text-sm font-semibold text-ink">Unplugged Era 🌿</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Zero notifications, mountain chalet / river drift stay, fresh regional feast, and stargazing under quiet skies.
              </p>
            </div>

            <div className="rounded-2xl border border-sand/60 bg-cream/30 p-4 transition hover:border-teal/30 hover:bg-white hover:shadow-xs">
              <span className="rounded bg-teal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-teal">Final Days</span>
              <h4 className="mt-2 font-display text-sm font-semibold text-ink">Core Memories &amp; Fly Home ✈️</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Artisan souvenir shopping, last golden hour brunch, and heading home with a camera roll full of unforgettable memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid items-center gap-6 overflow-hidden rounded-[26px] bg-[#f2ede3] p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:px-12 lg:py-10">
          <div className="max-w-2xl">
            <Eyebrow>100% Tailor-Made Packages</Eyebrow>
            <h2 className="mt-3 font-display text-[1.85rem] font-semibold leading-tight text-teal sm:text-[2.45rem]">
              Planning {destination.name}? Let’s build your tailor-made package.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Yatreo is a part of Rishav Travels (25+ years trusted). Every stay, driver, meal stop, and scenic diversion is shaped into a tailor-made package built around your pace and budget.
            </p>
          </div>
          <a
            className="button-gold gap-2 self-start px-7 py-3.5 lg:self-center"
            href={whatsappUrl(`Hi Yatreo, I'd like a tailor-made package for my upcoming trip to ${destination.name}.`)}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle size={17} /> Get My Tailor-Made Package
          </a>
        </div>
      </section>

      {/* Related recommendations */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1240px] px-5 pb-16 sm:px-8 sm:pb-24">
          <SectionHeading
            description="Other quiet escapes and inspiring routes you might love."
            eyebrow="More to explore"
            linkTo="/destinations"
            title="More journeys like this."
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((rel) => (
              <ImageCard destination={rel} key={rel.slug || rel.id} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
