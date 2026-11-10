import { MessageCircle } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { whatsappUrl } from "../../data/destinations";

export function ClosingBand() {
  return (
    <section className="closing-band">
      <div className="closing-inner">
        <div>
          <Eyebrow>Not sure where to start?</Eyebrow>
          <h2>Tell us who’s travelling. We’ll suggest a tailored plan.</h2>
        </div>
        <a
          className="button-teal min-h-12 gap-2 px-6"
          href={whatsappUrl("Hi Yatrio! I'm not sure where to go yet. Could you suggest a trip for us?")}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle size={16} /> Chat with us on WhatsApp
        </a>
      </div>
    </section>
  );
}
