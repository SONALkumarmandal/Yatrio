import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppConcierge } from "../common/WhatsAppConcierge";
import { PlaneCursor } from "../common/PlaneCursor";

export function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink antialiased">
      <PlaneCursor />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppConcierge />
    </div>
  );
}
