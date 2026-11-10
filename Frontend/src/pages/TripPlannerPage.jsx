import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Copy,
  Heart,
  MapPin,
  MessageCircle,
  Minus,
  Plane,
  Plus,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { YatreoMark } from "../components/layout/Logo";
import { whatsappUrl } from "../data/destinations";

const VIBES = [
  { id: "slow", label: "Slow Mornings", icon: "🌴", desc: "Backwaters & tea estates", match: "Kerala · Coorg", code: "COK" },
  { id: "mountains", label: "Mountain Passes", icon: "🏔️", desc: "Crisp peaks & starry skies", match: "Ladakh · Spiti", code: "IXL" },
  { id: "heritage", label: "Heritage Trails", icon: "🛕", desc: "Palaces & desert sunsets", match: "Rajasthan · Hampi", code: "JAI" },
  { id: "coast", label: "Coastal Glow", icon: "🌊", desc: "Hidden bays & golden swims", match: "South Goa · Gokarna", code: "GOI" },
  { id: "retreat", label: "Off-the-Grid", icon: "🪵", desc: "Orchards & quiet wood cabins", match: "Jibhi · Tirthan", code: "KUU" },
  { id: "beyond", label: "Beyond India", icon: "🌺", desc: "Tropical terraces & temples", match: "Bali · Sri Lanka", code: "DPS" },
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

✈️ Trip Vibe: ${selectedVibe.label} (${selectedVibe.icon})
📍 Preferred Match: ${selectedVibe.match}
👥 Travelers: ${travelerCount} persons (${travelerType})
💰 Budget: ~₹${budget.toLocaleString("en-IN")} per person (~₹${perDayEst.toLocaleString("en-IN")}/day)
🗓️ Timing: ${timing}
⏱️ Estimated Duration: ${durationEst}
${notes.trim() ? `📝 Special Wishes: "${notes.trim()}"` : ""}

Could you connect me with a human planner on WhatsApp to sketch the route?`;

  function copyBlueprint() {
    navigator.clipboard.writeText(blueprintMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="w-full px-4 py-4 sm:px-6 lg:px-10 xl:px-14">
      {/* Top Header Bar — Clean & Compact */}
      <div className="mb-4 flex flex-col justify-between gap-2 border-b border-sand/60 pb-3 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <Link className="text-xs text-muted hover:text-teal transition" to="/">
            Home
          </Link>
          <span className="text-xs text-sand">/</span>
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink">
            Custom Trip Studio
          </h1>
          <span className="rounded-full bg-warm/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warm-dark">
            Takes 45s
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5 font-medium text-ink">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Human concierge online
          </span>
          <span className="text-sand">·</span>
          <span>Zero bots · No logins required</span>
        </div>
      </div>

      {/* Main Single-Frame Panoramic Studio */}
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr] xl:grid-cols-[1.4fr_1fr] items-start">
        {/* Left Side: Clean Control Studio */}
        <div className="rounded-3xl border border-sand/70 bg-white/95 p-5 sm:p-6 shadow-sm space-y-5">
          {/* 1. Trip Vibe Selector */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal">
                1 · Vibe &amp; Scenery
              </span>
              <span className="text-xs text-muted">Pick your aesthetic</span>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {VIBES.map((vibe) => {
                const isActive = selectedVibe.id === vibe.id;
                return (
                  <button
                    className={`flex flex-col justify-between rounded-2xl border p-3 text-left transition-all ${
                      isActive
                        ? "border-teal bg-teal/5 ring-2 ring-teal/30 shadow-xs"
                        : "border-sand/60 bg-cream/25 hover:border-teal/40 hover:bg-white"
                    }`}
                    key={vibe.id}
                    onClick={() => setSelectedVibe(vibe)}
                    type="button"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{vibe.icon}</span>
                      {isActive && <Check className="text-teal" size={15} />}
                    </div>
                    <div className="mt-2">
                      <h3 className="font-display text-xs sm:text-[13px] font-semibold text-ink leading-snug">
                        {vibe.label}
                      </h3>
                      <p className="text-[11px] text-muted line-clamp-1">{vibe.desc}</p>
                    </div>
                    <span className="mt-1 text-[10px] font-semibold text-teal/80">
                      {vibe.match}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Travelers & Party Configuration */}
          <div className="grid gap-4 sm:grid-cols-2 border-t border-sand/40 pt-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal">
                2 · Who's Travelling
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Solo", "Couple", "Squad", "Family"].map((type) => (
                  <button
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      travelerType.includes(type)
                        ? "bg-teal text-cream shadow-xs"
                        : "border border-sand bg-cream/20 text-muted hover:border-teal/40 hover:bg-white"
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
              <div className="mt-2 flex items-center justify-between rounded-2xl border border-sand/70 bg-cream/25 px-3 py-1.5">
                <span className="text-xs text-muted">Number of people</span>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Decrease travelers"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-sand bg-white text-ink hover:bg-sand/30"
                    onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
                    type="button"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center font-display text-sm font-bold text-teal">
                    {travelerCount}
                  </span>
                  <button
                    aria-label="Increase travelers"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-sand bg-white text-ink hover:bg-sand/30"
                    onClick={() => setTravelerCount(travelerCount + 1)}
                    type="button"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Budget Estimator Slider */}
          <div className="border-t border-sand/40 pt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal">
                3 · Budget Per Person
              </span>
              <div className="text-right">
                <span className="font-display text-xl font-bold text-teal">
                  ₹{budget.toLocaleString("en-IN")}
                </span>
                <span className="ml-2 text-[11px] font-medium text-muted">
                  (~₹{perDayEst.toLocaleString("en-IN")}/day · {durationEst})
                </span>
              </div>
            </div>

            <input
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-sand accent-teal"
              max={120000}
              min={12000}
              onChange={(e) => setBudget(Number(e.target.value))}
              step={2000}
              type="range"
              value={budget}
            />

            <div className="mt-1 flex justify-between text-[10px] text-muted">
              <span>₹12k (Sweet &amp; Quick)</span>
              <span>₹35k (Comfort Heritage)</span>
              <span>₹70k (Premium Stay)</span>
              <span>₹1,20k+ (Luxury Slow)</span>
            </div>
          </div>

          {/* 4. When & Special Wishes Row */}
          <div className="grid gap-4 sm:grid-cols-2 border-t border-sand/40 pt-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal">
                4 · Ideal Timing
              </span>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {["Next 30 days", "In 1–3 months", "Festive dates", "Flexible"].map((opt) => (
                  <button
                    className={`rounded-xl border px-2.5 py-1.5 text-center text-[11px] font-semibold transition ${
                      timing === opt
                        ? "border-teal bg-teal text-cream"
                        : "border-sand bg-cream/25 text-muted hover:border-teal/30 hover:bg-white"
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

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal">
                5 · Special Wishes (Optional)
              </span>
              <input
                className="mt-2 w-full rounded-xl border border-sand bg-cream/25 px-3 py-2 text-xs text-ink outline-none transition focus:border-teal focus:bg-white"
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Mountain balcony, anniversary, pure veg..."
                type="text"
                value={notes}
              />
            </div>
          </div>
        </div>

        {/* Right Side: The Clean Boarding Pass Blueprint */}
        <div className="relative overflow-hidden rounded-3xl border border-teal/20 bg-[#0F5C5E] text-cream p-6 sm:p-7 shadow-xl flex flex-col justify-between">
          {/* Header Ticket Strip */}
          <div>
            <div className="flex items-center justify-between border-b border-cream/15 pb-4">
              <div className="flex items-center gap-2">
                <YatreoMark onDark size={28} />
                <div>
                  <span className="font-wordmark text-lg font-bold tracking-tight text-cream">
                    yatreo
                  </span>
                  <span className="block text-[9px] font-mono tracking-widest uppercase text-warm">
                    Live Blueprint
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-cream/10 px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-warm">
                Route #{selectedVibe.code}-2026
              </span>
            </div>

            {/* Flight Style Route Badge */}
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-black/20 p-3.5 border border-white/5">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cream/60">From</span>
                <p className="font-display text-sm font-semibold text-cream">Your City</p>
              </div>
              <div className="flex flex-col items-center px-2">
                <Plane className="text-warm rotate-90" size={16} />
                <span className="text-[9px] text-cream/50 mt-0.5">{durationEst}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-cream/60">To</span>
                <p className="font-display text-sm font-semibold text-warm">
                  {selectedVibe.match.split(" · ")[0]}
                </p>
              </div>
            </div>

            {/* Structured Specifications Grid */}
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs border-y border-cream/15 py-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cream/50">Vibe</span>
                <p className="mt-0.5 font-semibold text-cream">
                  {selectedVibe.icon} {selectedVibe.label}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cream/50">Travelers</span>
                <p className="mt-0.5 font-semibold text-cream">
                  {travelerCount} {travelerCount === 1 ? "Person" : "Persons"} ({travelerType.split(" ")[0]})
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cream/50">Budget</span>
                <p className="mt-0.5 font-semibold text-warm">
                  ₹{budget.toLocaleString("en-IN")} <span className="text-[10px] text-cream/60">/ pax</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cream/50">Timing</span>
                <p className="mt-0.5 font-semibold text-cream">{timing}</p>
              </div>
              {notes && (
                <div className="col-span-2 rounded-xl bg-white/5 p-2 text-[11px] text-cream/80">
                  <span className="text-warm font-semibold">Note:</span> "{notes}"
                </div>
              )}
            </div>
          </div>

          {/* Ticket Footer Actions */}
          <div className="mt-6 space-y-2.5">
            <a
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-warm px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink shadow-md transition-all hover:bg-warm-dark hover:text-white"
              href={whatsappUrl(blueprintMessage)}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle size={16} />
              <span>Plan with Human on WhatsApp</span>
            </a>

            <button
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-cream/20 bg-cream/10 px-4 py-2.5 text-xs font-semibold text-cream transition hover:bg-cream/20"
              onClick={copyBlueprint}
              type="button"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="text-emerald-300" size={14} />
                  <span className="text-emerald-300">Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Itinerary Blueprint</span>
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-cream/60 pt-1">
              No account creation needed. Direct chat with our travel concierges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
