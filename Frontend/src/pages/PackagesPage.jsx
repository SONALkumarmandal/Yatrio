import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Heart,
  MapPin,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Eyebrow } from "../components/ui/Eyebrow";
import { whatsappUrl } from "../data/destinations";

const PACKAGES = [
  {
    code: "YTR-BALI-06",
    slug: "bali",
    destinationKey: "Bali",
    title: "Bali: Ubud Mist & Uluwatu Cliff Vibes",
    region: "International · Indonesia",
    route: "Direct Flight → Denpasar → Ubud → Uluwatu",
    duration: "6 Days, 5 Nights",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=85",
    season: "April – October",
    badge: "Most Trending 🌴",
    highlights: [
      "Private jungle valley pool villa in Ubud",
      "Tegallalang rice terrace golden hour & floating breakfast",
      "Uluwatu ocean cliff sundowner & coastal beach club",
    ],
    timeline: [
      { day: "Day 01", title: "Touchdown & Villa Check-in 🌴", vibe: "Landing in Denpasar · Coconut welcome, private pool dip & Ubud night market crawl" },
      { day: "Day 02–03", title: "Main Character Jungle Era 🌿", vibe: "Secret jungle waterfalls, Tegallalang swings, matcha lattes & morning sound bath" },
      { day: "Day 04", title: "Uluwatu Ocean Cliffs 🌊", vibe: "Dramatic cliffside sunset, Kecak fire dance overlooking the sea & beach club chill" },
      { day: "Day 05–06", title: "Seminyak Thrift & Boarding ✈️", vibe: "Linen clothes shopping, acai bowls, sunset beach walk & flying back with 1000+ photos" },
    ],
  },
  {
    code: "YTR-THAI-06",
    slug: "thailand",
    destinationKey: "Thailand",
    title: "Thailand: Bangkok Neon & Phuket Island Hopping",
    region: "International · Thailand",
    route: "Direct Flights → Bangkok → Phuket → Phi Phi",
    duration: "6 Days, 5 Nights",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1400&q=85",
    season: "November – April",
    badge: "Party & Chill 🏝️",
    highlights: [
      "Private speedboat tour to Phi Phi & Maya Bay lagoons",
      "Iconic Bangkok skyline rooftop bar experience",
      "Seaside sunset resort stay in Phuket with beachfront pool",
    ],
    timeline: [
      { day: "Day 01", title: "Bangkok Street Food & Skylines 🍜", vibe: "Touchdown · Michelin street food in Chinatown & rooftop cocktails overlooking the city" },
      { day: "Day 02", title: "Fly to Phuket & Beach Chill 🏖️", vibe: "Smooth island hop flight, seaside check-in & sunset stroll on Kata beach" },
      { day: "Day 03–04", title: "Phi Phi Maya Bay Movie Scene 🚤", vibe: "Speedboat out to turquoise lagoons, snorkeling with reef fish & cliff jumping" },
      { day: "Day 05–06", title: "Old Town Cafés & Fly Back ✈️", vibe: "Pastel Sino-Portuguese street walk, authentic Thai massage & flight home fully energized" },
    ],
  },
  {
    code: "YTR-VIET-07",
    slug: "vietnam",
    destinationKey: "Vietnam",
    title: "Vietnam: Hanoi Street Food & Ha Long Bay Cruise",
    region: "International · Vietnam",
    route: "Direct Flights → Hanoi → Ha Long Bay → Da Nang",
    duration: "7 Days, 6 Nights",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=85",
    season: "September – April",
    badge: "Aesthetic Era ✨",
    highlights: [
      "Overnight luxury limestone karst cruise in Ha Long Bay",
      "Hanoi train street egg coffee & Old Quarter culinary tour",
      "Hoi An lantern boat evening & Ba Na Hills Golden Bridge",
    ],
    timeline: [
      { day: "Day 01–02", title: "Hanoi Train Street & Egg Coffee ☕", vibe: "Old Quarter scooter vibe, train zooming inches away, piping hot bowls of beef pho" },
      { day: "Day 03", title: "Ha Long Bay Luxury Cruise 🛳️", vibe: "Cruising emerald waters between thousand-year limestone peaks, kayaking into secret grottos" },
      { day: "Day 04–05", title: "Hoi An Lantern Lights & Ba Na Hills 🏮", vibe: "Golden Bridge held by giant hands, river lantern boat ride & tailor-made silk clothes" },
      { day: "Day 06–07", title: "Banh Mi Crawl & Airport Departure ✈️", vibe: "Crispy pork banh mi feast, riverside coffee & heading home with core memories unlocked" },
    ],
  },
  {
    code: "YTR-SRI-06",
    slug: "sri-lanka",
    destinationKey: "Sri Lanka",
    title: "Sri Lanka: Ella Scenic Train & Mirissa Surf",
    region: "International · Sri Lanka",
    route: "Direct Flights → Colombo → Ella → Mirissa",
    duration: "6 Days, 5 Nights",
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1400&q=85",
    season: "October – April",
    badge: "Scenic Slowdown 🚂",
    highlights: [
      "Iconic blue train ride across the Nine Arch Bridge",
      "Mirissa secret cove sunset & coconut tree hill walk",
      "Historic Galle Fort cobblestone street cafés & gelato",
    ],
    timeline: [
      { day: "Day 01", title: "Touchdown & Colombo Sunset 🌊", vibe: "Landing in Colombo · Coastal drive, fresh coconut hoppers & sea breeze walk" },
      { day: "Day 02–03", title: "The World’s Most Scenic Blue Train 🚂", vibe: "Hanging from open carriage doors through green tea mist, Nine Arch bridge photos" },
      { day: "Day 04", title: "Mirissa Surf & Coconut Hill 🏄", vibe: "South coast beaches, gentle beginner surf lesson & watching orange sunset from cliff" },
      { day: "Day 05–06", title: "Galle Fort Aesthetics & Fly Out ✈️", vibe: "Colonial Dutch ramparts, artisanal shops, seaside seafood feast & smooth airport drop" },
    ],
  },
  {
    code: "YTR-GOA-05",
    slug: "goa",
    destinationKey: "Goa",
    title: "Goa: South Goa Secret Coves & Latin Quarter",
    region: "India · West Coast",
    route: "Flight / Train → Mopa / Dabolim → Palolem",
    duration: "5 Days, 4 Nights",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=85",
    season: "October – March",
    badge: "Instant Getaway 🌊",
    highlights: [
      "Private heritage Portuguese villa stay with courtyard pool",
      "Fontainhas pastel lane walking tour & photography session",
      "Secret red-clay cove morning swim & fresh crab shack lunch",
    ],
    timeline: [
      { day: "Day 01", title: "Touchdown & Scooty Unlock 🛵", vibe: "Cruising quiet red-clay roads · Check-in to sunny boutique villa & sundowner dip" },
      { day: "Day 02", title: "Fontainhas Pastel Aesthetics 📸", vibe: "Pastel yellow heritage lane walk, sourdough bakeries, craft cocktails & vintage shops" },
      { day: "Day 03", title: "Island Ferry & Beach Shack Feast 🦀", vibe: "Divar island ferry crossing, cycling shaded coconut groves & authentic Goan fish curry" },
      { day: "Day 04–05", title: "Beach Blanket Bonfire & Fly Back 🌅", vibe: "Acoustic tunes on quiet sand, morning paddleboard & heading home sun-kissed" },
    ],
  },
  {
    code: "YTR-KER-06",
    slug: "kerala",
    destinationKey: "Kerala",
    title: "Kerala: Vembanad Houseboat & Munnar Hillside Mist",
    region: "India · South",
    route: "Flight / Train → Kochi → Alleppey → Munnar",
    duration: "6 Days, 5 Nights",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85",
    season: "October – March",
    badge: "Pure Serenity 🛶",
    highlights: [
      "Private luxury Vembanad houseboat drift with private chef",
      "Munnar rolling tea plantation hillside homestay",
      "Fort Kochi colonial art cafés & Kathakali evening",
    ],
    timeline: [
      { day: "Day 01", title: "Touchdown & Fort Kochi Chai ☕", vibe: "Art café hopping, spice market stroll & sunset at the ancient Chinese fishing nets" },
      { day: "Day 02–03", title: "Houseboat Main Character Drift 🛶", vibe: "Drifting quiet palm backwaters, freshly fried karimeen fish & sleeping under stars" },
      { day: "Day 04", title: "Munnar Unplugged Tea Era 🍃", vibe: "Misty tea garden trails, hidden waterfalls, zero phone notifications & balcony chai" },
      { day: "Day 05–06", title: "Cardamom Trails & Departure ✈️", vibe: "Spice estate foraging, hot banana chips haul & flying back 100% recharged" },
    ],
  },
  {
    code: "YTR-SRI-06",
    slug: "srinagar",
    destinationKey: "Srinagar",
    title: "Srinagar: Dal Lake Shikara & Gulmarg Snow Peaks",
    region: "India · Kashmir",
    route: "Direct Flight → Srinagar → Gulmarg → Pahalgam",
    duration: "6 Days, 5 Nights",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1400&q=85",
    season: "Year Round",
    badge: "Heaven on Earth ❄️",
    highlights: [
      "Hand-carved cedarwood luxury houseboat on Dal Lake",
      "Sunrise shikara ride to the floating vegetable & flower market",
      "Gulmarg Gondola cable car ride to Apharwat peak snowline",
    ],
    timeline: [
      { day: "Day 01", title: "First Light on Dal Lake 🛶", vibe: "Steaming hot saffron kahwa, carved wooden houseboat check-in & peaceful shikara glide" },
      { day: "Day 02", title: "Old Srinagar & Saffron Valleys 🌸", vibe: "Mughal gardens, heritage wooden bridges, saffron fields & royal wazwan dinner" },
      { day: "Day 03–04", title: "Gulmarg Gondola & Snow Magic ❄️", vibe: "World’s highest cable car ride, pine forest snow walk & steaming maggi in the mist" },
      { day: "Day 05–06", title: "Pahalgam Pine River & Flight Back ✈️", vibe: "Betaab Valley walks, walnut wood souvenirs & flying home completely in love" },
    ],
  },
];

const DESTINATION_FILTERS = [
  "All Packages",
  "Bali",
  "Thailand",
  "Vietnam",
  "Sri Lanka",
  "Goa",
  "Kerala",
  "Srinagar",
];

export function PackagesPage() {
  const [selectedDestination, setSelectedDestination] = useState("All Packages");
  const [cardViews, setCardViews] = useState({});

  const filtered =
    selectedDestination === "All Packages"
      ? PACKAGES
      : PACKAGES.filter((p) => p.destinationKey.toLowerCase() === selectedDestination.toLowerCase());

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-6 pb-14 sm:px-8 sm:pt-8 sm:pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted">
        <Link className="hover:text-teal" to="/">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-teal">Tailor-Made Packages</span>
      </div>

      {/* Catchy Eyebrow & Headline as requested */}
      <div className="mt-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-3.5 py-1 text-xs font-semibold text-teal">
          <Sparkles className="text-gold" size={13} />
          <span>Kaha chaloge ? Ghumate hai na ! 😏👀</span>
        </div>

        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.65rem] leading-[1.15]">
          Girlfriend bhi hai ! YA Boyfriend ke saath !? 😏👀🤫
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Chahe romantic couple getaway ho, squad ke saath full masti ya solo trip ka scene — <strong>Yatreo</strong> plans
          everything directly on WhatsApp. Verified boutique stays, private cabs, handpicked routes and <strong>zero hidden fees</strong>.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-teal font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="text-emerald-500" size={14} /> 100% Tailor-made Packages
          </span>
          <span className="text-sand">·</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="text-teal" size={14} /> A part of Rishav Travels (25+ Years)
          </span>
          <span className="text-sand">·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="text-warm-dark" size={14} /> WhatsApp quote in ~4 mins
          </span>
        </div>
      </div>

      {/* Destination Filters (Mood filters removed completely) */}
      <div className="mt-7 flex flex-wrap items-center gap-2 border-b border-sand pb-4">
        {DESTINATION_FILTERS.map((dest) => (
          <button
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              selectedDestination === dest
                ? "bg-teal text-cream shadow-sm"
                : "border border-sand bg-white text-muted hover:border-teal/40 hover:text-ink"
            }`}
            key={dest}
            onClick={() => setSelectedDestination(dest)}
            type="button"
          >
            {dest}
          </button>
        ))}
      </div>

      {/* Grid of 7 Packages without rates & with Gen-Z Hinglish buttons */}
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((pkg) => {
          const isTimeline = cardViews[pkg.code] === "timeline";
          return (
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
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-black/20" />

                <span className="absolute left-3.5 top-3.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-teal shadow-sm">
                  {pkg.badge}
                </span>

                <span className="absolute right-3.5 top-3.5 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-mono font-semibold text-warm backdrop-blur-md">
                  {pkg.code}
                </span>

                <div className="absolute bottom-3 left-3.5 right-3.5 text-cream">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-warm">{pkg.region}</span>
                  <h3 className="font-serif text-xl font-medium leading-snug">{pkg.title}</h3>
                </div>
              </div>

              {/* Content Details (Rates removed completely) */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="font-medium text-ink flex items-center gap-1">
                      <Clock size={13} className="text-teal" /> {pkg.duration}
                    </span>
                    <span className="font-semibold text-teal">Best: {pkg.season}</span>
                  </div>

                  <div className="mt-2.5 text-[11px] text-muted font-mono">{pkg.route}</div>

                  {/* Switcher between Highlights and Gen-Z Vibe Timeline */}
                  <div className="mt-4 flex items-center justify-between border-t border-sand/40 pt-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink">
                      {isTimeline ? "Vibe Timeline ⚡" : "Key Highlights"}
                    </span>
                    <div className="inline-flex rounded-lg bg-sand/30 p-0.5 text-[10px] font-semibold">
                      <button
                        className={`rounded-md px-2 py-0.5 transition ${
                          !isTimeline ? "bg-white text-teal shadow-xs" : "text-muted hover:text-ink"
                        }`}
                        onClick={() => setCardViews({ ...cardViews, [pkg.code]: "highlights" })}
                        type="button"
                      >
                        Highlights
                      </button>
                      <button
                        className={`flex items-center gap-1 rounded-md px-2 py-0.5 transition ${
                          isTimeline ? "bg-teal text-white shadow-xs" : "text-muted hover:text-ink"
                        }`}
                        onClick={() => setCardViews({ ...cardViews, [pkg.code]: "timeline" })}
                        type="button"
                      >
                        <Sparkles className={isTimeline ? "text-warm" : "text-muted"} size={10} />
                        Timeline
                      </button>
                    </div>
                  </div>

                  {/* Timeline or Highlights content */}
                  {isTimeline ? (
                    <div className="mt-3 space-y-2.5 border-l-2 border-teal/20 pl-3">
                      {pkg.timeline.map((step, idx) => (
                        <div className="relative text-xs" key={idx}>
                          <span className="absolute -left-[17px] top-1 h-2 w-2 rounded-full border border-white bg-teal" />
                          <div className="flex items-baseline gap-1.5">
                            <span className="rounded bg-teal/10 px-1 py-0.2 font-mono text-[9px] font-bold text-teal">
                              {step.day}
                            </span>
                            <span className="text-[11px] font-semibold text-ink">{step.title}</span>
                          </div>
                          <p className="mt-0.5 text-[10px] leading-relaxed text-muted">{step.vibe}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {pkg.highlights.map((h) => (
                        <li className="flex items-start gap-2 text-xs text-ink/85" key={h}>
                          <Check className="mt-0.5 shrink-0 text-teal" size={13} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Bottom Card Footer: Rates Removed + Gen-Z Hinglish Action Buttons */}
                <div className="mt-6 border-t border-sand/50 pt-4">
                  <div className="flex items-center justify-between pb-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium text-teal border border-sand">
                      <Sparkles size={11} className="text-gold" /> Custom Quote on WhatsApp
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600">Zero hidden fees</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      aria-label={`View ${pkg.title} details`}
                      className="flex-1 rounded-full border border-teal/30 py-2.5 text-center text-xs font-bold text-teal transition hover:bg-teal hover:text-cream flex items-center justify-center gap-1"
                      to={`/destinations/${pkg.slug}`}
                    >
                      <span>Itinerary Dekho 👀</span>
                    </Link>
                    <a
                      className="button-gold flex-1 py-2.5 text-center text-xs font-bold justify-center gap-1.5"
                      href={whatsappUrl(`Hi Yatreo! Mujhe "${pkg.title}" (${pkg.code}) ka scene banana hai! Can you share custom itinerary & quote?`)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <MessageCircle size={14} />
                      <span>Scene Banao 🚀</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* The Yatreo Standard: Simpler words & prioritized */}
      <section className="mt-14 rounded-3xl border border-sand bg-white p-7 sm:p-10 shadow-sm">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal">
            <ShieldCheck size={14} className="text-teal" /> The Yatreo Standard
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Simple promises. High standards. Zero drama.
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Here is our exact priority checklist for every single trip we design:
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Priority 1 */}
          <div className="rounded-2xl border border-sand/70 bg-cream/30 p-5 transition hover:border-teal hover:bg-white hover:shadow-xs">
            <span className="rounded-md bg-teal px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cream">
              Priority #1
            </span>
            <h3 className="mt-3 font-display text-base font-semibold text-ink">
              Real Human, Zero Bots 💬
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              You chat directly with a real, well-travelled human planner on WhatsApp. Fast replies in ~4 minutes.
            </p>
          </div>

          {/* Priority 2 */}
          <div className="rounded-2xl border border-sand/70 bg-cream/30 p-5 transition hover:border-teal hover:bg-white hover:shadow-xs">
            <span className="rounded-md bg-teal px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cream">
              Priority #2
            </span>
            <h3 className="mt-3 font-display text-base font-semibold text-ink">
              100% Tailor-Made 🎯
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              Built around your dates, vibe, and budget. Handpicked stays and private transit — never cookie-cutter tourist buses.
            </p>
          </div>

          {/* Priority 3 */}
          <div className="rounded-2xl border border-sand/70 bg-cream/30 p-5 transition hover:border-teal hover:bg-white hover:shadow-xs">
            <span className="rounded-md bg-teal px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cream">
              Priority #3
            </span>
            <h3 className="mt-3 font-display text-base font-semibold text-ink">
              No Hidden Fees, Ever 🛡️
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              What we quote on WhatsApp is all you pay. Stays, private driver, fuel, tolls and taxes are crystal clear upfront.
            </p>
          </div>

          {/* Priority 4 */}
          <div className="rounded-2xl border border-sand/70 bg-cream/30 p-5 transition hover:border-teal hover:bg-white hover:shadow-xs">
            <span className="rounded-md bg-teal px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cream">
              Priority #4
            </span>
            <h3 className="mt-3 font-display text-base font-semibold text-ink">
              25+ Years Backing 🤝
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              Yatreo is a part of Rishav Travels. Flight delayed or mountain pass closed? We handle live alternatives on the spot.
            </p>
          </div>
        </div>

        {/* Gen-Z Hinglish Bottom CTA */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-teal p-6 text-cream sm:flex-row sm:px-8">
          <div>
            <h4 className="font-display text-lg font-semibold text-cream">
              Bhai scene set hai? Chalo plan banate hain! 🚀
            </h4>
            <p className="text-xs text-cream/75 mt-0.5">
              Dates batao, log batao — baaki sab Yatreo par chhod do.
            </p>
          </div>
          <a
            className="button-gold gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap shadow-md"
            href={whatsappUrl("Hi Yatreo! Kaha chaloge? Ghumate hai na! Mujhe custom tailor-made trip plan karwani hai.")}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle size={16} /> WhatsApp Pe Chalein? 📲
          </a>
        </div>
      </section>
    </div>
  );
}
