import { useState } from "react";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { whatsappUrl } from "../../data/destinations";

export function WhatsAppConcierge() {
  const [minimized, setMinimized] = useState(false);

  return (
    <aside aria-label="WhatsApp Trip Concierge" className="fixed bottom-5 right-5 z-40">
      {!minimized ? (
        <div className="relative flex items-center gap-2 rounded-full border border-teal/20 bg-white/95 py-2 pl-3.5 pr-2 shadow-[0_12px_32px_rgba(15,92,94,0.18)] backdrop-blur-md transition-all hover:shadow-[0_16px_40px_rgba(15,92,94,0.24)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>

          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-ink">Human planner online</span>
            <span className="text-[9px] text-muted">Replies in ~4 mins · No bots</span>
          </div>

          <a
            aria-label="Chat with a human trip planner on WhatsApp"
            className="flex items-center gap-1.5 rounded-full bg-teal px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-cream transition hover:bg-teal-hover focus:outline-none focus:ring-2 focus:ring-teal"
            href={whatsappUrl("Hi Yatreo! I’m exploring trips on your site and would love to brainstorm with a human planner.")}
            rel="noopener noreferrer"
            target="_blank"
          >
            <MessageCircle size={14} />
            <span>Chat</span>
          </a>

          <button
            aria-label="Minimize concierge badge"
            className="rounded-full p-1 text-muted/60 transition hover:bg-sand/60 hover:text-ink"
            onClick={() => setMinimized(true)}
            title="Minimize"
            type="button"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          aria-label="Open human planner chat"
          className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-teal text-cream shadow-xl transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-teal/30"
          onClick={() => setMinimized(false)}
          type="button"
        >
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
          </span>
          <MessageCircle size={24} />
        </button>
      )}
    </aside>
  );
}
