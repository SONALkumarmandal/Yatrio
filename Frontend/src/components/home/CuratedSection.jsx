import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageCard } from "../ui/ImageCard";
import { SectionHeading } from "../ui/SectionHeading";
import { whatsappUrl } from "../../data/destinations";

const featuredTrips = [
  { slug: "kerala", mood: "Slow Mornings", route: "Delhi → Kochi", code: "YTR-KER-05", imagePosition: "center 55%" },
  { slug: "ladakh", mood: "Big Adventures", route: "Delhi → Leh", code: "YTR-LAD-07", imagePosition: "center 48%" },
  { slug: "rajasthan", mood: "Heritage Trails", route: "Delhi → Jaipur", code: "YTR-RAJ-06", imagePosition: "center 56%" },
];

function BoardingPass({ code, destination, duration, imagePosition, mood, route }) {
  if (!destination) return null;

  return (
    <article className="boarding-pass">
      <Link
        aria-label={`${mood}: ${destination.name} — view destination`}
        className="boarding-pass-main"
        to={`/destinations/${destination.slug}`}
      >
        <div className="boarding-pass-image-wrap">
          <img
            alt={`${destination.name} landscape`}
            className="boarding-pass-image"
            loading="lazy"
            src={destination.image}
            style={{ objectPosition: imagePosition }}
          />
          <span className="boarding-pass-stamp">{mood}</span>
        </div>
        <div className="boarding-pass-copy">
          <span className="boarding-pass-route">
            {route} <span>·</span> {code}
          </span>
          <h3>
            {mood}: {destination.name}
          </h3>
          <p>
            {duration} <span>·</span> {destination.state}
          </p>
        </div>
      </Link>
      <div className="boarding-pass-stub">
        <span className="boarding-pass-price-label">A little getaway from</span>
        <p>
          {destination.price} <span>per person</span>
        </p>
        <a
          className="button-gold boarding-pass-book"
          href={whatsappUrl(`Hi Yatreo! I'd like to enquire about the ${mood}: ${destination.name} trip.`)}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle size={15} /> Book Now
        </a>
      </div>
    </article>
  );
}

export function CuratedSection({ destinations = [] }) {
  const favourites = ["kerala", "ladakh", "rajasthan", "goa", "himachal", "bali"]
    .map((slug) => destinations.find((destination) => destination.slug === slug))
    .filter(Boolean);

  const displayList = favourites.length > 0 ? favourites : destinations.slice(0, 6);

  return (
    <>
      <section className="section-shell" id="discover">
        <SectionHeading
          description="Six lovely places to start with. And a real person ready to help you find the one you do."
          eyebrow="Stamp your passport"
          linkTo="/destinations"
          title="A little bit of India & beyond."
        />
        <div className="destination-stamp-grid">
          {displayList.map((destination, index) => (
            <ImageCard
              className={index === 0 ? "destination-tile destination-tile-featured" : "destination-tile"}
              destination={destination}
              key={destination.slug || destination.id}
            />
          ))}
        </div>
      </section>

      <section className="section-shell section-tint" id="packages">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            description="A few well-loved ways to go. Each one thoughtfully planned, and always made your own."
            eyebrow="Curated boarding passes"
            linkTo="/packages"
            title="Choose your kind of journey."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {featuredTrips.map(({ slug, mood, route, code, imagePosition }, index) => {
              const destination = destinations.find((place) => place.slug === slug) || destinations[index];
              return (
                <BoardingPass
                  code={code}
                  destination={destination}
                  duration={["5 days, 4 nights", "7 days, 6 nights", "6 days, 5 nights"][index]}
                  imagePosition={imagePosition}
                  key={slug}
                  mood={mood}
                  route={route}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
