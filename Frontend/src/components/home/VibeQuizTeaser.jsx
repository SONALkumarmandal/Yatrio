import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Coffee, Landmark, Mountain, Sparkles, Trees, Waves } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";

const QUIZ_OPTIONS = [
  { label: "Slow Mornings & Tea Hills", Icon: Coffee, match: "Kerala Backwaters", slug: "kerala", price: "from ₹18,500" },
  { label: "High Himalayan Passes", Icon: Mountain, match: "Ladakh & Pangong Tso", slug: "ladakh", price: "from ₹32,000" },
  { label: "Desert Havelis & Sunsets", Icon: Landmark, match: "Rajasthan Trails", slug: "rajasthan", price: "from ₹24,500" },
  { label: "Hidden Bays & Sea Swims", Icon: Waves, match: "South Goa Shore", slug: "goa", price: "from ₹14,000" },
  { label: "Quiet Apple Orchards", Icon: Trees, match: "Himachal Valley", slug: "himachal", price: "from ₹21,000" },
];

export function VibeQuizTeaser() {
  const [selected, setSelected] = useState(QUIZ_OPTIONS[0]);
  const SelectedIcon = selected.Icon;

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-8 sm:px-8">
      <div className="overflow-hidden rounded-3xl border border-sand bg-gradient-to-br from-white via-white to-[#f7f1e7] p-6 shadow-sm sm:p-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <Eyebrow>15-Second Vibe Matcher</Eyebrow>
              <span className="flex items-center gap-1 rounded-full bg-warm/20 px-2.5 py-0.5 text-[11px] font-bold text-warm-dark">
                <Sparkles size={11} /> Quick Quiz
              </span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
              What kind of energy do you need right now?
            </h2>
            <p className="mt-2 text-xs text-muted sm:text-sm">
              Tap any mood to instantly see where you should go next.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {QUIZ_OPTIONS.map((item) => {
                const ItemIcon = item.Icon;
                const isSelected = selected.label === item.label;
                return (
                  <button
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                      isSelected
                        ? "bg-teal text-cream shadow-sm scale-105"
                        : "border border-sand bg-cream/30 text-muted hover:border-teal/40 hover:text-ink hover:bg-white"
                    }`}
                    key={item.label}
                    onClick={() => setSelected(item)}
                    type="button"
                  >
                    <ItemIcon className={isSelected ? "text-gold" : "text-teal"} size={14} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between rounded-2xl border border-teal/15 bg-teal/5 p-6 text-center sm:min-w-[280px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal">Perfect Match</span>
            <span className="mt-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal text-gold shadow-xs">
              <SelectedIcon size={24} strokeWidth={2} />
            </span>
            <h3 className="mt-2 font-display text-xl font-bold text-ink">{selected.match}</h3>
            <p className="text-xs font-medium text-muted">{selected.price} · Tailored to you</p>

            <div className="mt-4 flex w-full flex-col gap-2">
              <Link
                className="button-teal flex w-full items-center justify-center gap-1.5 py-2.5 text-xs font-semibold"
                to={`/destinations/${selected.slug}`}
              >
                <span>View Journey</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                className="flex items-center justify-center text-[11px] font-semibold text-teal hover:underline"
                to="/plan"
              >
                Or build a custom blueprint →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
