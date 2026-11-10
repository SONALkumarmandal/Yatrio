import { Heart, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { whatsappUrl } from "../../data/destinations";

export function ClosingBand() {
  return (
    <section className="closing-band">
      <div className="closing-inner">
        <div className="max-w-2xl">
          <Eyebrow>100% Tailor-Made Packages</Eyebrow>
          <h2 className="mt-2 text-2xl sm:text-3xl font-display font-semibold text-ink">
            No cookie-cutter trips. Get a tailor-made package built around your vibe.
          </h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            From verified boutique stays and private drivers to offbeat local diversions — every single detail is shaped into a tailor-made package built for you.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-teal">
            <span className="flex items-center gap-1.5">
              <Sparkles className="text-gold" size={14} /> 100% Tailor-made packages
            </span>
            <span className="text-sand">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="text-teal" size={14} /> Zero hidden fees
            </span>
            <span className="text-sand">·</span>
            <span className="flex items-center gap-1.5">
              <Heart className="fill-rose-500 text-rose-500" size={14} /> Planned by real humans
            </span>
          </div>
        </div>

        <a
          className="button-teal min-h-12 gap-2 px-6 text-xs uppercase tracking-wider font-semibold whitespace-nowrap shadow-sm hover:shadow-md transition"
          href={whatsappUrl("Hi Yatreo! I’d love to get a tailor-made package designed for our upcoming trip.")}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle size={16} /> Get My Tailor-made Package
        </a>
      </div>
    </section>
  );
}
