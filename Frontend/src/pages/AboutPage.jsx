import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Heart,
  Leaf,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Eyebrow } from "../components/ui/Eyebrow";
import { YatreoMark } from "../components/layout/Logo";
import { whatsappUrl } from "../data/destinations";

export function AboutPage() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-6 pb-12 sm:px-8 sm:pt-8 sm:pb-14">
      {/* Hero Section */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Link className="hover:text-teal" to="/">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-teal">Our Story</span>
        </div>
        <div className="mt-2.5">
          <Eyebrow>The Yatreo Story</Eyebrow>
        </div>
        <div className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-3.5 py-1 text-xs font-semibold text-teal">
          <Sparkles className="text-gold" size={13} />
          <span>Yatreo is a part of Rishav Travels · Flying High since 25+ years</span>
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
          Born from <span className="text-teal font-serif">yatra</span> &amp;{" "}
          <span className="text-warm-dark font-serif">yatri</span>.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
          Yatreo is a part of <strong>Rishav Travels</strong>, combining 25+ years of verified on-ground travel expertise
          with a modern, slow-travel philosophy. We believe holiday planning shouldn’t feel like taking a second job.
          Instead of cookie-cutter algorithms and hidden fees, Yatreo connects you directly with a well-travelled friend over
          WhatsApp to design 100% tailor-made packages.
        </p>
      </div>

      {/* Brand Identity Showcase Card */}
      <div className="mt-7 overflow-hidden rounded-3xl border border-teal/20 bg-[#0F5C5E] p-7 text-cream shadow-xl sm:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-warm px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-ink">
              Confirmed Brand Identity
            </span>
            <div className="mt-6 flex items-center gap-4">
              <YatreoMark onDark size={56} />
              <span className="font-wordmark text-4xl font-extrabold tracking-[-0.05em] text-cream">yatreo</span>
            </div>
            <h2 className="mt-6 font-display text-2xl font-medium sm:text-3xl text-cream">
              Every yatra, your story.
            </h2>
            <p className="mt-2 text-sm text-warm font-semibold tracking-wider">Holidays, handled.</p>

            <p className="mt-4 text-xs leading-relaxed text-cream/75">
              The Fork with a plane represents every crossroad in your travels — guided by the runway of thoughtful
              planning, taking off toward sunsets over water.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
            <h3 className="font-display text-lg font-semibold text-cream">What is confirmed</h3>
            <div className="mt-4 space-y-3 text-xs text-cream/80">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-cream/50 uppercase tracking-wider text-[10px]">Name</span>
                <span className="font-semibold text-cream">Yatreo, from yatra + yatri</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-cream/50 uppercase tracking-wider text-[10px]">Logo</span>
                <span className="font-semibold text-cream">The Fork, with a plane</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-cream/50 uppercase tracking-wider text-[10px]">Palette</span>
                <span className="font-semibold text-cream">Palette A · Sunrise Over Water</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-cream/50 uppercase tracking-wider text-[10px]">Typography</span>
                <span className="font-semibold text-cream">Fraunces · Hind · Yatra One</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-cream/50 uppercase tracking-wider text-[10px]">Parent Company</span>
                <span className="font-semibold text-warm">Rishav Travels (25+ years)</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-cream/50 uppercase tracking-wider text-[10px]">Brand Voice</span>
                <span className="font-semibold text-cream">A well-travelled friend</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cream/50 uppercase tracking-wider text-[10px]">Booking</span>
                <span className="font-semibold text-warm">Through WhatsApp, no accounts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Philosophy Cards */}
      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        <div className="rounded-3xl border border-sand bg-white p-7 shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/10 text-teal">
            <Heart size={22} />
          </span>
          <h3 className="mt-4 font-display text-xl font-semibold text-ink">Tailor-made packages</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            We don’t believe in cookie-cutter 4-night packages. Every stay, driver, meal stop, and scenic diversion is
            a 100% tailor-made package adapted to your timing, vibe, and budget.
          </p>
        </div>

        <div className="rounded-3xl border border-sand bg-white p-7 shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/10 text-teal">
            <Leaf size={22} />
          </span>
          <h3 className="mt-4 font-display text-xl font-semibold text-ink">Slow &amp; considered</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Less time stuck in tourist traps, more time sipping cardamom tea on a plantation balcony or watching blue
            mountain sunsets.
          </p>
        </div>

        <div className="rounded-3xl border border-sand bg-white p-7 shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/10 text-teal">
            <ShieldCheck size={22} />
          </span>
          <h3 className="mt-4 font-display text-xl font-semibold text-ink">Human concierge</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            You always have a dedicated person you can message before your flight, during the journey, or if weather
            changes your mountain pass.
          </p>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div className="mt-14 rounded-3xl border border-sand bg-[#f5ede1] p-8 text-center sm:p-12">
        <span className="inline-block rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal uppercase tracking-wider">
          100% Tailor-Made Packages
        </span>
        <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Want a tailor-made package designed just for you?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Say hi on WhatsApp. Tell us when you have time off and where your heart is leaning — our team at Yatreo (a part of Rishav Travels) will build your custom itinerary.
        </p>
        <a
          className="button-gold mx-auto mt-6 inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider"
          href={whatsappUrl("Hi Yatreo! I loved reading your story and would love to get a tailor-made package designed for our trip.")}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle size={16} /> Plan a tailor-made package on WhatsApp
        </a>
      </div>
    </div>
  );
}
