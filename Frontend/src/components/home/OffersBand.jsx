import { MessageCircle } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { WaveDivider } from "./HeroSection";
import { whatsappUrl } from "../../data/destinations";

export function OffersBand() {
  return (
    <section className="offers-band">
      <WaveDivider />
      <div className="offers-content">
        <Eyebrow light>A little something extra</Eyebrow>
        <div className="offers-card">
          <span aria-hidden="true" className="offers-sun" />
          <div className="relative">
            <span className="offers-kicker">Tailor-made seasonal perks</span>
            <h2>Early Bird Holiday Savings</h2>
            <p>Save up to 15% on tailor-made packages across Kerala, Rajasthan, and Andaman when booking 30 days ahead.</p>
          </div>
          <a
            className="button-gold min-h-12 gap-2 px-6"
            href={whatsappUrl("Hi Yatreo, tell me about your tailor-made packages and seasonal offers.")}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle size={16} /> Get Tailor-Made Offer
          </a>
        </div>
      </div>
    </section>
  );
}
