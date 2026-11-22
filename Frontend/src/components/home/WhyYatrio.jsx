import { ArrowRight, Heart, Leaf, ShieldCheck } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { whatsappUrl } from "../../data/destinations";

export function WhyYatrio() {
  const reasons = [
    {
      icon: Heart,
      priority: "#1",
      title: "Real Human, No Bots",
      text: "A real, well-travelled human planner on WhatsApp who listens and replies in ~4 mins.",
    },
    {
      icon: Leaf,
      priority: "#2",
      title: "100% Tailor-Made",
      text: "Curated for your vibe, private cab, and handpicked stays. Never forced onto group buses.",
    },
    {
      icon: ShieldCheck,
      priority: "#3",
      title: "Zero Hidden Fees",
      text: "Clear honest pricing upfront. What we quote on WhatsApp is what you pay. Not a rupee extra.",
    },
  ];

  return (
    <section className="section-shell pt-2" id="about">
      <div className="why-panel flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-[510px]">
          <Eyebrow light>The Yatreo Standard</Eyebrow>
          <h2 className="mt-3 font-display text-[1.75rem] font-semibold leading-tight text-white sm:text-[2.4rem] lg:text-[2.7rem]">
            Simple promises. High standards. Zero drama.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-white/70 sm:mt-4 sm:text-base">
            Backed by 25+ years of Rishav Travels. No fuss, no hidden surcharges — just genuine care for how you travel.
          </p>
          <a
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-deep transition hover:bg-[#ffd07e] sm:mt-7 sm:w-auto"
            href={whatsappUrl("Hi Yatreo, tell me more about how you plan trips.")}
            rel="noreferrer"
            target="_blank"
          >
            Scene Banao WhatsApp Pe <ArrowRight size={16} />
          </a>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 lg:max-w-[560px]">
          {reasons.map(({ icon: Icon, priority, title, text }) => (
            <div className="flex gap-3 sm:flex-col" key={title}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold font-mono text-xs font-bold">
                {priority}
              </span>
              <div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
