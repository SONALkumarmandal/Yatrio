import {
  Car,
  Check,
  Heart,
  Hotel,
  MessageCircle,
  Plane,
  ShieldCheck,
  Ship,
  Train,
} from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { TripPlanner } from "./TripPlanner";

export function WaveDivider() {
  return (
    <div aria-hidden="true" className="wave-divider">
      <svg preserveAspectRatio="none" viewBox="0 0 1440 150">
        <path d="M0 68C190 108 297 25 510 51s341 85 541 41 257-44 389-13v71H0Z" fill="#5DB7AE" />
        <path d="M0 94c204-35 331 25 530 8s316-70 521-39 257 30 389 10v77H0Z" fill="#0F5C5E" />
        <path d="M0 123c169-23 316 5 509 4s352-29 532-18 277 16 399 5v36H0Z" fill="#112A2D" />
      </svg>
    </div>
  );
}

function TrustItem({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3 sm:justify-center sm:border-r sm:border-sand last:sm:border-0">
      <span className="trust-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span className="max-w-[190px] text-sm font-semibold leading-5 text-ink">{title}</span>
    </div>
  );
}

export function HeroSection({ destinations = [] }) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-inner">
          <div aria-hidden="true" className="hero-sun" />
          <div aria-hidden="true" className="hero-flight-path">
            <Plane size={17} />
          </div>
          <div className="hero-content">
            <Eyebrow>Holiday packages</Eyebrow>
            <h1 className="hero-title">
              Every yatra,
              <br />
              <span>your story.</span>
            </h1>
            <p className="hero-description">
              Holidays, handled. Tell us where you want to go, and a real person plans the rest with you on WhatsApp.
            </p>

            {/* Travel Components Highlight Note */}
            <div className="mb-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-teal/15 bg-white/85 px-3.5 py-1.5 text-[11px] font-semibold text-ink shadow-xs backdrop-blur-sm">
              <span className="flex items-center gap-1 text-teal font-medium">
                <Plane className="text-warm" size={13} /> Flight
              </span>
              <span className="text-sand">·</span>
              <span className="flex items-center gap-1 text-teal font-medium">
                <Train className="text-warm" size={13} /> Train
              </span>
              <span className="text-sand">·</span>
              <span className="flex items-center gap-1 text-teal font-medium">
                <Ship className="text-warm" size={13} /> Cruise
              </span>
              <span className="text-sand">·</span>
              <span className="flex items-center gap-1 text-teal font-medium">
                <Hotel className="text-warm" size={13} /> Hotels
              </span>
              <span className="text-sand">·</span>
              <span className="flex items-center gap-1 text-teal font-medium">
                <Car className="text-warm" size={13} /> Cabs
              </span>
            </div>

            <TripPlanner destinations={destinations} />
          </div>
          <div className="hero-visual">
            <img
              alt="A quiet Kerala backwater, framed by coconut palms at golden hour"
              className="hero-photo"
              fetchPriority="high"
              src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1300&q=90"
            />
            <div aria-label="Signature journey: Slow Mornings, Kerala" className="hero-stamp">
              <span className="font-accent text-lg">यात्रा</span>
              <span>Slow mornings</span>
              <span>Kerala · Since always</span>
            </div>
            <p className="hero-caption">
              Vembanad backwaters <span>·</span> Kerala
            </p>
          </div>
        </div>
        <WaveDivider />
      </section>

      <section aria-label="What makes Yatrio different" className="trust-bar">
        <div className="mx-auto grid max-w-[1240px] gap-5 px-5 py-6 sm:px-8 lg:grid-cols-4 lg:py-7">
          <TrustItem icon={MessageCircle} title="A real person on WhatsApp" />
          <TrustItem icon={Check} title="No hidden fees only, not ever" />
          <TrustItem icon={Heart} title="Plans built around you" />
          <TrustItem icon={ShieldCheck} title="Support before and during your trip" />
        </div>
      </section>
    </>
  );
}
