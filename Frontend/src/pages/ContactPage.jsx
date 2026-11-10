import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send, Sparkles } from "lucide-react";
import { Eyebrow } from "../components/ui/Eyebrow";
import { whatsappUrl } from "../data/destinations";

export function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [where, setWhere] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const formatted = `Hi Yatreo! My name is ${name || "Traveler"}.
I'm hoping to plan a trip to ${where || "somewhere lovely"}.
Message: "${message || "Please share trip ideas!"}"
Phone: ${phone || "Will chat here on WhatsApp"}`;

    window.open(whatsappUrl(formatted), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-6 pb-12 sm:px-8 sm:pt-8 sm:pb-14">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Link className="hover:text-teal" to="/">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-teal">Contact Us</span>
        </div>
        <div className="mt-2.5">
          <Eyebrow>Human Concierge</Eyebrow>
        </div>
        <div className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-3.5 py-1 text-xs font-semibold text-teal">
          <Sparkles className="text-gold" size={13} />
          <span>Yatreo is a part of Rishav Travels · Flying High since 25+ years</span>
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
          Say hello. We love talking trips.
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-base">
          Whether you have a rough idea or an exact date, our team at Yatreo (a part of Rishav Travels) is right here on WhatsApp to craft your 100% tailor-made package.
        </p>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-2">
        {/* Contact Information & WhatsApp Box */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-teal/20 bg-[#0F5C5E] p-8 text-cream shadow-lg">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-warm">Online on WhatsApp</span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-medium sm:text-3xl text-cream">
              Fastest reply is on WhatsApp
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-cream/75">
              Average reply time is ~4 minutes. We share photos of stays, map routes, and adjust itineraries live in the
              chat.
            </p>
            <a
              className="button-gold mt-6 inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider"
              href={whatsappUrl("Hi Yatreo! I’d like to speak with a human trip planner.")}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle size={17} /> Open WhatsApp Chat
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
              <Mail className="text-teal" size={20} />
              <h3 className="mt-3 text-xs font-semibold text-ink">Email</h3>
              <p className="mt-1 text-xs text-muted">hello@yatreo.com</p>
              <p className="text-[11px] text-muted/70">Partnerships &amp; custom queries</p>
            </div>

            <div className="rounded-2xl border border-sand bg-white p-5 shadow-sm">
              <Clock className="text-teal" size={20} />
              <h3 className="mt-3 text-xs font-semibold text-ink">Concierge Hours</h3>
              <p className="mt-1 text-xs text-muted">10:00 AM – 8:00 PM IST</p>
              <p className="text-[11px] text-muted/70">Monday to Sunday</p>
            </div>
          </div>

          <div className="rounded-2xl border border-teal/20 bg-teal/5 p-4 text-xs text-ink/85 flex items-start gap-3">
            <Sparkles className="text-gold shrink-0 mt-0.5" size={16} />
            <div>
              <p className="font-semibold text-teal">A Venture of Rishav Travels</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                Yatreo is a part of Rishav Travels — backing every journey with 25+ years of verified on-ground operations, direct fleet transit, and zero hidden costs.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Message Form */}
        <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">Request a Tailor-made Package</h2>
            <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-warm-dark">Custom</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Share your thoughts below and we’ll design a tailor-made package directly in your WhatsApp conversation.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-ink">Your Name</label>
              <input
                className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-xs text-ink outline-none transition focus:border-teal focus:bg-white"
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
                type="text"
                value={name}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink">Phone / WhatsApp Number (optional)</label>
              <input
                className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-xs text-ink outline-none transition focus:border-teal focus:bg-white"
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                type="tel"
                value={phone}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink">Where do you want to go?</label>
              <input
                className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-xs text-ink outline-none transition focus:border-teal focus:bg-white"
                onChange={(e) => setWhere(e.target.value)}
                placeholder="e.g. Kerala backwaters, Ladakh, or surprise me"
                required
                type="text"
                value={where}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink">Message or Preferences</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-sand bg-cream/30 p-2.5 text-xs text-ink outline-none transition focus:border-teal focus:bg-white"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your timing, who is traveling, and what you’d love to do..."
                rows={3}
                value={message}
              />
            </div>

            <button
              className="button-teal flex w-full items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider shadow-sm"
              type="submit"
            >
              <Send size={15} /> Send to WhatsApp Planner
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
