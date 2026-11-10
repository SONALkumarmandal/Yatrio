import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  Compass,
  MapPin,
  MessageCircle,
  Plane,
  Sparkles,
} from "lucide-react";
import { Eyebrow } from "../components/ui/Eyebrow";
import { whatsappUrl } from "../data/destinations";

const PACKAGES = [
  {
    code: "YTR-KER-05",
    slug: "kerala",
    title: "Slow Mornings: Kerala Backwaters",
    region: "South India",
    route: "Delhi / Mumbai → Kochi → Alleppey",
    duration: "6 Days, 5 Nights",
    mood: "Slow Mornings",
    price: "₹18,500",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85",
    season: "October – March",
    highlights: ["Private houseboat drift through Vembanad", "Organic spice plantation lunch", "Munnar tea hillside homestay"],
    badge: "Most Loved",
  },
  {
    code: "YTR-LAD-07",
    slug: "ladakh",
    title: "Big Adventures: Ladakh High Passes",
    region: "North India",
    route: "Delhi → Leh → Nubra → Pangong",
    duration: "7 Days, 6 Nights",
    mood: "Big Adventures",
    price: "₹32,000",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85",
    season: "June – September",
    highlights: ["Overnight stargazing at Pangong Tso", "Khardung La pass crossing", "Quiet monastery sunrise prayers"],
    badge: "Bucket List",
  },
  {
    code: "YTR-RAJ-06",
    slug: "rajasthan",
    title: "Heritage Trails: Rajasthan Stories",
    region: "West India",
    route: "Delhi → Jaipur → Jodhpur → Udaipur",
    duration: "6 Days, 5 Nights",
    mood: "Heritage Trails",
    price: "₹24,500",
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1400&q=85",
    season: "October – March",
    highlights: ["Sunset boat ride on Lake Pichola", "Blue city rooftop dinner in Jodhpur", "Restored haveli stays with local hosts"],
    badge: "Cultural Classic",
  },
  {
    code: "YTR-GOA-05",
    slug: "goa",
    title: "Coastal Escapes: South Goa & Spice Trails",
    region: "West India",
    route: "Direct Flights → Dabolim / Mopa → Palolem",
    duration: "5 Days, 4 Nights",
    mood: "Coastal Escapes",
    price: "₹14,000",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=85",
    season: "November – February",
    highlights: ["Secret red clay coves and morning swims", "Portuguese quarter heritage walk", "Fresh catch fisherman beach dinners"],
    badge: "Quick Getaway",
  },
  {
    code: "YTR-HIM-06",
    slug: "himachal",
    title: "Mountain Retreats: Jibhi & Tirthan Valley",
    region: "North India",
    route: "Delhi / Chandigarh → Aut → Jibhi",
    duration: "6 Days, 5 Nights",
    mood: "Mountain Retreats",
    price: "₹21,000",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=85",
    season: "March – November",
    highlights: ["Wooden chalet stay by rushing stream", "Hike to Jalori Pass & Serolsar Lake", "Traditional Himachali home-cooked meals"],
    badge: "Offbeat & Quiet",
  },
  {
    code: "YTR-BAL-07",
    slug: "bali",
    title: "Beyond India: Ubud Terraces & Coast",
    region: "Beyond India",
    route: "International Flights → Denpasar → Ubud",
    duration: "7 Days, 6 Nights",
    mood: "Beyond India",
    price: "₹48,000",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=85",
    season: "April – October",
    highlights: ["Villa with jungle valley infinity pool", "Morning sunrise yoga & sound bath", "Private day trip to Uluwatu sunset cliffs"],
    badge: "International",
  },
];

export function PackagesPage() {
  const [selectedMood, setSelectedMood] = useState("All");

  const moods = ["All", "Slow Mornings", "Big Adventures", "Heritage Trails", "Coastal Escapes", "Mountain Retreats", "Beyond India"];

  const filtered = selectedMood === "All" ? PACKAGES : PACKAGES.filter((p) => p.mood === selectedMood);

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-6 pb-12 sm:px-8 sm:pt-8 sm:pb-14">
      {/* Intro */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Link className="hover:text-teal" to="/">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-teal">Curated Boarding Passes</span>
        </div>
        <div className="mt-2.5">
          <Eyebrow>Hand-Curated Journeys</Eyebrow>
        </div>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
          Choose your kind of journey.
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-base">
          Thoughtfully planned boarding passes with transparent pricing, lovely accommodations, and custom flexibility
          built in.
        </p>
      </div>

      {/* Mood Filters */}
      <div className="mt-5 flex flex-wrap items-center gap-2 border-b border-sand pb-4">
        {moods.map((m) => (
          <button
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              selectedMood === m
                ? "bg-teal text-cream shadow-sm"
                : "border border-sand bg-white text-muted hover:border-teal/40 hover:text-ink"
            }`}
            key={m}
            onClick={() => setSelectedMood(m)}
            type="button"
          >
            {m}
          </button>
        ))}
      </div>

      {/* Grid of Boarding Passes */}
      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((pkg) => (
          <article
            className="group flex flex-col overflow-hidden rounded-3xl border border-sand bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            key={pkg.code}
          >
            {/* Visual Top */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand/30">
              <img
                alt={pkg.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={pkg.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-black/20" />

              <span className="absolute left-3.5 top-3.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-teal shadow-sm">
                {pkg.badge}
              </span>

              <span className="absolute right-3.5 top-3.5 rounded-full bg-ink/60 px-2.5 py-1 text-[11px] font-mono font-semibold text-warm backdrop-blur-md">
                {pkg.code}
              </span>

              <div className="absolute bottom-3 left-3 right-3 text-cream">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-warm">{pkg.region}</span>
                <h3 className="font-serif text-xl font-medium leading-snug">{pkg.title}</h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{pkg.duration}</span>
                  <span className="font-semibold text-teal">Best: {pkg.season}</span>
                </div>

                <div className="mt-3 text-[11px] text-muted font-mono">{pkg.route}</div>

                <ul className="mt-4 space-y-2 border-t border-sand/40 pt-3">
                  {pkg.highlights.map((h) => (
                    <li className="flex items-start gap-2 text-xs text-ink/85" key={h}>
                      <Check className="mt-0.5 shrink-0 text-teal" size={13} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 flex items-center justify-between border-t border-sand/50 pt-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted">All-inclusive from</span>
                  <p className="font-serif text-xl font-bold text-ink">{pkg.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    aria-label={`View ${pkg.title} details`}
                    className="rounded-full border border-teal/20 px-3.5 py-2 text-xs font-semibold text-teal hover:bg-teal hover:text-cream"
                    to={`/destinations/${pkg.slug}`}
                  >
                    Details
                  </Link>
                  <a
                    className="button-gold gap-1.5 px-4 py-2 text-xs font-semibold"
                    href={whatsappUrl(`Hi Yatreo! I'm interested in the "${pkg.title}" package (${pkg.code}). Can you share itinerary details?`)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <MessageCircle size={14} /> Book
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
