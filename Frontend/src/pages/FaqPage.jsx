import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MessageCircle, Search } from "lucide-react";
import { Eyebrow } from "../components/ui/Eyebrow";
import { whatsappUrl } from "../data/destinations";

const FAQS = [
  {
    q: "How does booking through WhatsApp work?",
    a: "It’s as simple as chatting with a well-travelled friend! You share your ideal dates, destinations, or vibe with us on WhatsApp. A dedicated human planner replies with personalized itinerary ideas, stays, and pricing. Once you approve the plan, we lock in your boutique stays and cabs.",
  },
  {
    q: "Do I need to create an account or password?",
    a: "No! As our brand confirms: 'Booking through WhatsApp, no accounts'. You can browse freely and book directly on WhatsApp. An optional traveler dashboard is available if you want to save favorites online, but it’s completely optional.",
  },
  {
    q: "What is included in the package price?",
    a: "Every Yatreo trip includes handpicked accommodations, private inter-city sanitized transportation with verified local drivers, daily breakfasts, and signature local experiences (such as private houseboats, monastery visits, or spice plantation tours). Flights can be added on request.",
  },
  {
    q: "Can I customize the route or add more nights?",
    a: "Absolutely! Nothing at Yatreo is copy-pasted. If you want an extra night in Munnar to read books by a tea garden, or want to detour to Pangong Lake, we adjust every itinerary to your exact pace.",
  },
  {
    q: "What happens if our plans change or flights get delayed?",
    a: "Your human planner stays in direct WhatsApp contact throughout your trip. If high altitude weather closes a mountain pass or your flight changes, we rearrange hotels and cabs on the fly without leaving you stranded.",
  },
  {
    q: "How do payments work?",
    a: "We accept all major UPI, Net Banking, and credit cards via secure Razorpay payment links sent directly in your WhatsApp conversation. A standard deposit locks in your trip, with balance due prior to departure.",
  },
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = search
    ? FAQS.filter(
        (f) =>
          f.q.toLowerCase().includes(search.toLowerCase()) ||
          f.a.toLowerCase().includes(search.toLowerCase())
      )
    : FAQS;

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-6 pb-12 sm:px-8 sm:pt-8 sm:pb-14">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Link className="hover:text-teal" to="/">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-teal">FAQs</span>
        </div>
        <div className="mt-2.5">
          <Eyebrow>Common Questions</Eyebrow>
        </div>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
          Everything you want to know.
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-base">
          Clear answers about how we plan, book, and handle your holiday. No fine print tricks.
        </p>

        {/* Search Input */}
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            className="w-full rounded-full border border-sand bg-white py-2.5 pl-11 pr-4 text-xs text-ink shadow-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/10"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search any question (e.g. payments, customisation, cancellations)..."
            type="search"
            value={search}
          />
        </div>
      </div>

      {/* Accordion */}
      <div className="mt-10 max-w-3xl space-y-3">
        {filtered.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              className="overflow-hidden rounded-2xl border border-sand bg-white shadow-sm transition"
              key={item.q}
            >
              <button
                className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-ink sm:text-base"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                type="button"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`shrink-0 text-teal transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  size={18}
                />
              </button>
              {isOpen && (
                <div className="border-t border-sand/40 bg-cream/20 px-5 pb-5 pt-3 text-xs leading-relaxed text-muted sm:text-sm">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions banner */}
      <div className="mt-14 max-w-3xl rounded-3xl border border-sand bg-[#f6efe4] p-6 text-center sm:p-8">
        <h3 className="font-display text-xl font-semibold text-ink">Have a specific question in mind?</h3>
        <p className="mt-1 text-xs text-muted">
          Our planners are online right now on WhatsApp to answer any destination or route queries.
        </p>
        <a
          className="button-teal mx-auto mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider"
          href={whatsappUrl("Hi Yatreo! I have a question about planning a trip.")}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle size={15} /> Ask a Planner on WhatsApp
        </a>
      </div>
    </div>
  );
}
