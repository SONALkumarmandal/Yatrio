import { useEffect, useState } from "react";
import { HeroSection } from "../components/home/HeroSection";
import { CuratedSection } from "../components/home/CuratedSection";
import { HowItWorks } from "../components/home/HowItWorks";
import { OffersBand } from "../components/home/OffersBand";
import { Testimonials } from "../components/home/Testimonials";
import { ClosingBand } from "../components/home/ClosingBand";
import { WhyYatrio } from "../components/home/WhyYatrio";
import * as destinationsApi from "../services/destinationsApi";

export function HomePage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await destinationsApi.getDestinations({ pageSize: 20 });
        if (res?.items) {
          setDestinations(res.items);
        }
      } catch (err) {
        console.error("Error loading destinations for HomePage:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <HeroSection destinations={destinations} />
      <CuratedSection destinations={destinations} loading={loading} />
      <HowItWorks />
      <OffersBand />
      <Testimonials />
      <ClosingBand />
      <WhyYatrio />
    </div>
  );
}
