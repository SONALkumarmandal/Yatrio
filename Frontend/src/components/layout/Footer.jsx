import {
  BookOpen,
  Heart,
  HelpCircle,
  Mail,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { whatsappUrl } from "../../data/destinations";

export function Footer() {
  return (
    <footer className="border-t border-[#e2d7c5] bg-[#112A2D] text-cream">
      <div className="mx-auto max-w-[1240px] px-5 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Intro */}
          <div className="md:col-span-2">
            <Logo onDark size="large" />
            <p className="mt-4 max-w-sm text-sm text-cream/75 leading-relaxed">
              Thoughtfully planned holidays across India and beyond. Real humans, tailored routes, and zero rush.
            </p>
            <p className="mt-2 text-xs font-mono text-warm">yatra (journey) + yatri (traveller)</p>
            <p className="mt-1.5 text-xs text-cream/60">
              Yatreo is a part of <strong className="text-cream font-semibold">Rishav Travels</strong> · Flying High since 25+ years.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-cream transition-colors hover:bg-teal-hover"
                href={whatsappUrl("Hi Yatreo! I’d like to plan a holiday with a human planner.")}
                rel="noopener noreferrer"
                target="_blank"
              >
                <MessageCircle size={15} />
                Chat on WhatsApp
              </a>
              <Link
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-cream transition-colors hover:bg-white/10"
                to="/plan"
              >
                <Sparkles size={14} className="text-warm" />
                Custom Planner
              </Link>
            </div>
          </div>

          {/* Regional Explorer */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-warm">Explore Journeys</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/75">
              <li>
                <Link className="hover:text-cream transition" to="/destinations?region=North">
                  North India &amp; Himalayas
                </Link>
              </li>
              <li>
                <Link className="hover:text-cream transition" to="/destinations?region=South">
                  South India &amp; Backwaters
                </Link>
              </li>
              <li>
                <Link className="hover:text-cream transition" to="/destinations?region=West">
                  Rajasthan &amp; Goa
                </Link>
              </li>
              <li>
                <Link className="hover:text-cream transition" to="/destinations?region=Beyond">
                  Beyond India (Bali &amp; more)
                </Link>
              </li>
              <li>
                <Link className="hover:text-cream transition" to="/packages">
                  Curated Boarding Passes
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-warm">Yatreo Info</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/75">
              <li>
                <Link className="hover:text-cream transition" to="/about">
                  Our Story &amp; Brand
                </Link>
              </li>
              <li>
                <Link className="hover:text-cream transition" to="/faq">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link className="hover:text-cream transition" to="/contact">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link className="hover:text-cream transition" to="/plan">
                  Custom Trip Builder
                </Link>
              </li>
              <li>
                <Link className="hover:text-cream transition" to="/dashboard">
                  Traveler Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Semi-Footer: Heritage & Transparency Trust Band */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-y border-white/10 py-4.5 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2.5">
            <Plane className="text-warm rotate-45" size={17} />
            <span className="font-display text-sm sm:text-base font-semibold tracking-wide text-warm">
              Flying High since more than 25 years
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cream/90">
            <ShieldCheck className="text-emerald-400" size={15} />
            <span>No hidden fees only, not ever</span>
          </div>
        </div>

        {/* Dedicated Quick Action Buttons for Our Story, FAQs, and Contact */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-warm animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cream/90">
              Company &amp; Concierge Support
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-cream transition hover:border-warm hover:bg-warm hover:text-ink"
              to="/about"
            >
              <BookOpen size={13} />
              <span>Our Story</span>
            </Link>
            <Link
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-cream transition hover:border-warm hover:bg-warm hover:text-ink"
              to="/faq"
            >
              <HelpCircle size={13} />
              <span>FAQs</span>
            </Link>
            <Link
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-cream transition hover:border-warm hover:bg-warm hover:text-ink"
              to="/contact"
            >
              <Mail size={13} />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between border-t border-cream/10 pt-6 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Yatreo. Every yatra, your story. Holidays, handled.</p>
          <p className="mt-2 flex items-center gap-1 sm:mt-0">
            Crafted with <Heart className="fill-warm text-warm" size={13} /> for thoughtful travelers.
          </p>
        </div>
      </div>
    </footer>
  );
}
