import { ArrowRight, Heart, Leaf, ShieldCheck } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { whatsappUrl } from "../../data/destinations";

export function WhyYatrio() {
  const reasons = [
    {
      icon: Heart,
      title: "Made around you",
      text: "Your pace, your people, your kind of trip. Never a cookie-cutter itinerary.",
    },
    {
      icon: Leaf,
      title: "Locally considered",
      text: "The lovely small boutique stays, responsible guides, and quieter routes matter to us.",
    },
    {
      icon: ShieldCheck,
      title: "There when it counts",
      text: "A friendly dedicated human to help before your trip, during your journey, and until you are home.",
    },
  ];

  return (
    <section className="section-shell pt-2" id="about">
      <div className="why-panel">
        <div className="max-w-[510px]">
          <Eyebrow light>The good kind of different</Eyebrow>
          <h2 className="mt-3 font-display text-[2rem] font-semibold leading-tight text-white sm:text-[2.7rem]">
            Good travel feels like it was meant for you.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/70 sm:text-base">
            No fuss, no surprises. Just people who care about where you go — and how you feel when you get there.
          </p>
          <a
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-deep transition hover:bg-[#ffd07e]"
            href={whatsappUrl("Hi Yatreo, tell me more about how you plan trips.")}
            rel="noreferrer"
            target="_blank"
          >
            Come say hello <ArrowRight size={16} />
          </a>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3 lg:mt-0 lg:max-w-[560px]">
          {reasons.map(({ icon: Icon, title, text }) => (
            <div className="flex gap-3 sm:flex-col" key={title}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold">
                <Icon size={19} />
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
