import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Globe,
  Landmark,
  MessageCircle,
  Minus,
  Mountain,
  Palmtree,
  Plane,
  Plus,
  Sparkles,
  Tent,
  Users,
  Wallet,
  Waves,
} from "lucide-react";
import { YatreoMark } from "../components/layout/Logo";
import { whatsappUrl } from "../data/destinations";

const VIBES = [
  {
    id: "slow",
    label: "Slow Mornings",
    Icon: Palmtree,
    desc: "Backwaters & tea estates",
    match: "Kerala · Coorg",
    code: "COK",
  },
  {
    id: "mountains",
    label: "Mountain Passes",
    Icon: Mountain,
    desc: "Crisp peaks & starry skies",
    match: "Ladakh · Spiti",
    code: "IXL",
  },
  {
    id: "heritage",
    label: "Heritage Trails",
    Icon: Landmark,
    desc: "Palaces & desert sunsets",
    match: "Rajasthan · Hampi",
    code: "JAI",
  },
  {
    id: "coast",
    label: "Coastal Glow",
    Icon: Waves,
    desc: "Hidden bays & golden swims",
    match: "South Goa · Gokarna",
    code: "GOI",
  },
  {
    id: "retreat",
    label: "Off-the-Grid",
    Icon: Tent,
    desc: "Orchards & wood cabins",
    match: "Jibhi · Tirthan",
    code: "KUU",
  },
  {
    id: "beyond",
    label: "Beyond India",
    Icon: Globe,
    desc: "Tropical terraces & seas",
    match: "Bali · Sri Lanka",
    code: "DPS",
  },
];

export function TripPlannerPage() {
  const [selectedVibe, setSelectedVibe] = useState(VIBES[0]);
  const [travelerCount, setTravelerCount] = useState(2);
  const [travelerType, setTravelerType] = useState("Duo / Couple");
  const [budget, setBudget] = useState(32000);
  const [timing, setTiming] = useState("In 1–3 months");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const durationEst = budget < 20000 ? "4–5 days" : budget < 45000 ? "6–7 days" : "8–10 days";
  const perDayEst = Math.round(budget / (budget < 20000 ? 5 : budget < 45000 ? 6 : 9));

  const blueprintMessage = `Hi Yatreo! Let's build a holiday together.

Trip Vibe: ${selectedVibe.label}
Preferred Match: ${selectedVibe.match}
Travelers: ${travelerCount} persons (${travelerType})
Budget: ~₹${budget.toLocaleString("en-IN")} per person (~₹${perDayEst.toLocaleString("en-IN")}/day)
Timing: ${timing}
Estimated Duration: ${durationEst}
${notes.trim() ? `Special Wishes: "${notes.trim()}"` : ""}

Could you connect me with a human planner on WhatsApp to sketch the route?`;

  function copyBlueprint() {
    navigator.clipboard.writeText(blueprintMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  const ActiveVibeIcon = selectedVibe.Icon;

  return (
    <div className="mx-auto w-full max-w-[1260px] px-4 pt-3 pb-10 sm:px-6 lg:px-8 lg:pb-6">
      {/* Compact Top Header Bar */}
      <div className="mb-3 flex flex-col justify-between gap-1.5 border-b border-sand/60 pb-2.5 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2.5">
          <Link className="text-xs text-muted transition hover:text-teal" to="/">
            Home
          </Link>
          <span className="text-xs text-sand">/</span>
          <h1 className="font-display text-lg font-bold tracking-tight text-teal sm:text-xl">
            Custom Trip Studio
          </h1>
          <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warm-dark">
            Takes 45s
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5 font-semibold text-teal">
            <span className="h-2 w-2 animate-pulse rounded-full bg-lagoon" />
            Human concierge online
          </span>
          <span className="text-sand">·</span>
          <span>Zero bots · No logins required</span>
        </div>
      </div>

      {/* Main Single-Frame Studio */}
      <div className="grid items-stretch gap-4 lg:grid-cols-[1.35fr_0.95fr]">
        {/* Left Side: Compact Control Studio */}
        <div className="flex flex-col justify-between space-y-3 rounded-2xl border border-sand/80 bg-white/95 p-4 shadow-sm sm:p-5">
          {/* 1. Trip Vibe Selector */}
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal">
                <Compass className="text-gold" size={13} />
                1 · Vibe &amp; Scenery
              </span>
              <span className="text-[11px] text-muted">Pick your aesthetic</span>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {VIBES.map((vibe) => {
                const isActive = selectedVibe.id === vibe.id;
                const VibeIcon = vibe.Icon;
                return (
                  <button
                    className={`group relative flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                      isActive
                        ? "border-teal bg-teal/[0.05] ring-1 ring-teal/30 shadow-2xs"
                        : "border-sand/70 bg-cream/25 hover:border-teal/40 hover:bg-white"
                    }`}
                    key={vibe.id}
                    onClick={() => setSelectedVibe(vibe)}
                    type="button"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? "bg-teal text-gold"
                          : "bg-sand/40 text-teal group-hover:bg-teal/10"
                      }`}
                    >
                      <VibeIcon size={16} strokeWidth={2} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-xs font-semibold text-ink">
                        {vibe.label}
                      </h3>
                      <p className="truncate text-[10px] font-medium text-teal/80">
                        {vibe.match}
                      </p>
                    </div>
                    {isActive && (
                      <Check className="shrink-0 text-teal" size={13} strokeWidth={2.5} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Travelers & Party Configuration */}
          <div className="grid gap-3 border-t border-sand/50 pt-3 sm:grid-cols-2 sm:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal">
                <Users className="text-gold" size={13} />
                2 · Who&apos;s Travelling
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {["Solo", "Couple", "Squad", "Family"].map((type) => (
                  <button
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                      travelerType.includes(type)
                        ? "bg-teal text-cream shadow-2xs"
                        : "border border-sand bg-cream/25 text-muted hover:border-teal/40 hover:bg-white hover:text-ink"
                    }`}
                    key={type}
                    onClick={() =>
                      setTravelerType(
                        type === "Solo"
                          ? "Solo Wanderer"
                          : type === "Couple"
                          ? "Duo / Couple"
                          : type === "Squad"
                          ? "The Squad"
                          : "Family Yatra"
                      )
                    }
                    type="button"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Stepper Count */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal">
                Travelers Count
              </span>
              <div className="mt-1.5 flex items-center justify-between rounded-xl border border-sand/70 bg-cream/25 px-3 py-1">
                <span className="text-[11px] text-muted">Number of people</span>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Decrease travelers"
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-sand bg-white text-teal transition hover:border-teal hover:bg-teal/5"
                    onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
                    type="button"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-5 text-center font-display text-sm font-bold text-teal">
                    {travelerCount}
                  </span>
                  <button
                    aria-label="Increase travelers"
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-sand bg-white text-teal transition hover:border-teal hover:bg-teal/5"
                    onClick={() => setTravelerCount(travelerCount + 1)}
                    type="button"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Budget Estimator Slider */}
          <div className="border-t border-sand/50 pt-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal">
                <Wallet className="text-gold" size={13} />
                3 · Budget Per Person
              </span>
              <div className="text-right">
                <span className="font-display text-lg font-bold text-teal">
                  ₹{budget.toLocaleString("en-IN")}
                </span>
                <span className="ml-1.5 text-[11px] font-medium text-muted">
                  (~₹{perDayEst.toLocaleString("en-IN")}/day · {durationEst})
                </span>
              </div>
            </div>

            <input
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-sand accent-teal"
              max={120000}
              min={12000}
              onChange={(e) => setBudget(Number(e.target.value))}
              step={2000}
              type="range"
              value={budget}
            />

            <div className="mt-1 flex justify-between text-[10px] text-muted">
              <span>₹12k <span className="hidden sm:inline">(Quick Escape)</span></span>
              <span>₹35k <span className="hidden sm:inline">(Comfort)</span></span>
              <span>₹70k <span className="hidden sm:inline">(Boutique)</span></span>
              <span>₹1.2L+ <span className="hidden sm:inline">(Luxury)</span></span>
            </div>
          </div>

          {/* 4. Ideal Timing & 5. Special Wishes Row */}
          <div className="grid gap-3 border-t border-sand/50 pt-3 sm:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal">
                <CalendarDays className="text-gold" size={13} />
                4 · Ideal Timing
              </span>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                {["Next 30 days", "In 1–3 months", "Festive dates", "Flexible"].map((opt) => (
                  <button
                    className={`rounded-lg border px-2 py-1 text-center text-[11px] font-semibold transition ${
                      timing === opt
                        ? "border-teal bg-teal text-cream"
                        : "border-sand bg-cream/25 text-muted hover:border-teal/40 hover:bg-white hover:text-ink"
                    }`}
                    key={opt}
                    onClick={() => setTiming(opt)}
                    type="button"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal">
                <Sparkles className="text-gold" size={13} />
                5 · Special Wishes (Optional)
              </span>
              <input
                className="mt-1.5 w-full rounded-xl border border-sand bg-cream/25 px-3 py-2 text-xs text-ink outline-none transition focus:border-teal focus:bg-white"
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Mountain balcony, anniversary, pure veg..."
                type="text"
                value={notes}
              />
            </div>
          </div>
        </div>

        {/* Right Side: The Clean Boarding Pass Blueprint */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-teal/20 bg-teal p-4 text-cream shadow-lg sm:p-5">
          {/* Header Ticket Strip */}
          <div>
            <div className="flex items-center justify-between border-b border-cream/15 pb-3">
              <div className="flex items-center gap-2">
                <YatreoMark onDark size={26} />
                <div>
                  <span className="font-wordmark text-base font-bold tracking-tight text-cream">
                    yatreo
                  </span>
                  <span className="block text-[9px] font-mono uppercase tracking-widest text-gold">
                    Live Blueprint
                  </span>
                </div>
              </div>
              <span className="rounded-full border border-gold/25 bg-deep/40 px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-gold">
                Route #{selectedVibe.code}-2026
              </span>
            </div>

            {/* Flight Style Route Badge */}
            <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-deep/50 px-3.5 py-2.5">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-cream/60">From</span>
                <p className="font-display text-sm font-semibold text-cream">Your City</p>
              </div>
              <div className="flex flex-col items-center px-2">
                <Plane className="rotate-90 text-gold" size={15} />
                <span className="mt-0.5 text-[9px] text-lagoon">{durationEst}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-cream/60">To</span>
                <p className="font-display text-sm font-semibold text-gold">
                  {selectedVibe.match.split(" · ")[0]}
                </p>
              </div>
            </div>

            {/* Structured Specifications Grid */}
            <div className="mt-3 grid grid-cols-2 gap-2.5 border-y border-cream/15 py-3 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cream/55">Vibe</span>
                <p className="mt-0.5 flex items-center gap-1.5 font-semibold text-cream">
                  <ActiveVibeIcon className="shrink-0 text-gold" size={13} />
                  <span className="truncate">{selectedVibe.label}</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cream/55">Travelers</span>
                <p className="mt-0.5 flex items-center gap-1.5 font-semibold text-cream">
                  <Users className="shrink-0 text-lagoon" size={13} />
                  <span>
                    {travelerCount} {travelerCount === 1 ? "Person" : "Persons"} ({travelerType.split(" ")[0]})
                  </span>
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cream/55">Budget</span>
                <p className="mt-0.5 flex items-center gap-1.5 font-semibold text-gold">
                  <Wallet className="shrink-0 text-gold" size={13} />
                  <span>
                    ₹{budget.toLocaleString("en-IN")} <span className="text-[10px] font-normal text-cream/65">/ pax</span>
                  </span>
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cream/55">Timing</span>
                <p className="mt-0.5 flex items-center gap-1.5 font-semibold text-cream">
                  <CalendarDays className="shrink-0 text-lagoon" size={13} />
                  <span>{timing}</span>
                </p>
              </div>
              {notes && (
                <div className="col-span-2 rounded-lg bg-deep/35 px-2.5 py-1.5 text-[11px] text-cream/85">
                  <span className="font-semibold text-gold">Note:</span> &quot;{notes}&quot;
                </div>
              )}
            </div>
          </div>

          {/* Ticket Footer Actions */}
          <div className="mt-3.5 space-y-2">
            <a
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-deep shadow-md transition-all hover:bg-[#ffd07e]"
              href={whatsappUrl(blueprintMessage)}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle size={15} />
              <span>Plan with Human on WhatsApp</span>
            </a>

            <button
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-cream/25 bg-deep/25 px-4 py-2 text-xs font-semibold text-cream transition hover:bg-deep/45"
              onClick={copyBlueprint}
              type="button"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="text-lagoon" size={14} />
                  <span className="text-lagoon">Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="text-gold" size={14} />
                  <span>Copy Itinerary Blueprint</span>
                </>
              )}
            </button>

            <p className="pt-0.5 text-center text-[10px] text-cream/65">
              No account creation needed. Direct chat with our travel concierges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
