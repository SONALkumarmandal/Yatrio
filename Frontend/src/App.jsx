import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  Heart,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  Plane,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { destinations, regions, whatsappUrl } from "./data/destinations.js";

const featuredTrips = [
  { slug: "kerala", mood: "Slow Mornings", route: "Delhi → Kochi", code: "YTR-KER-05", imagePosition: "center 55%" },
  { slug: "ladakh", mood: "Big Adventures", route: "Delhi → Leh", code: "YTR-LAD-07", imagePosition: "center 48%" },
  { slug: "rajasthan", mood: "Heritage Trails", route: "Delhi → Jaipur", code: "YTR-RAJ-06", imagePosition: "center 56%" },
];

function Logo({ onDark = false }) {
  const logoColor = onDark ? "text-cream" : "text-teal";
  const planeColor = onDark ? "#F4A93B" : "#0F5C5E";

  return (
    <Link aria-label="Yatreo home" className={`yatreo-logo ${logoColor}`} to="/">
      <svg aria-hidden="true" className="yatreo-logo-mark" fill="none" viewBox="0 0 46 46">
        <path d="M22.8 42V25.3C22.8 21.3 20.8 18.6 16.7 14L8.7 5" stroke="currentColor" strokeLinecap="round" strokeWidth="3.3" />
        <path d="M22.8 25.3C22.8 21.3 25 18.4 29.1 14L37.3 5" stroke="currentColor" strokeLinecap="round" strokeWidth="3.3" />
        <path d="M22.8 35V32.8M22.8 28.5V26.3M22.8 22V20.1M19 18.4L17.6 16.8M14.8 13.8L13.4 12.2M27 18.4L28.5 16.8M31.3 13.8L32.7 12.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
        <path d="m35.5 4-5.2 13.1-12 6.1-5.2-1.7-2.1 1.8 7.2 5.2-4.6 7.6 2 1.8 7-6.1 5.6 7.1 2.1-2.2-1.7-5.1 6-12.1L39 6.2 35.5 4Z" fill={planeColor} />
      </svg>
      <span className="yatreo-logo-word">yatreo</span>
      <span className="yatreo-logo-tagline">holidays, handled</span>
    </Link>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const closeMenu = () => setMenuOpen(false);
  const activeSection = pathname === "/" ? hash.slice(1) : "";
  const destinationsActive = pathname.startsWith("/destinations");
  const packagesActive = pathname === "/packages" || activeSection === "packages";
  const aboutActive = activeSection === "about";
  const contactActive = activeSection === "contact";

  useEffect(() => {
    if (!hash) return;

    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [pathname, hash]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e1d5]/80 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-9 md:flex" aria-label="Main navigation">
          <NavLink
            aria-current={destinationsActive ? "page" : undefined}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            to="/destinations"
          >
            Destinations
          </NavLink>
          <Link aria-current={packagesActive ? "location" : undefined} className={`nav-link${packagesActive ? " active" : ""}`} to="/#packages">
            Packages
          </Link>
          <Link aria-current={aboutActive ? "location" : undefined} className={`nav-link${aboutActive ? " active" : ""}`} to="/#about">
            About
          </Link>
          <Link aria-current={contactActive ? "location" : undefined} className={`nav-link${contactActive ? " active" : ""}`} to="/#contact">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <a
            className="button-gold hidden min-h-11 items-center gap-2 px-5 sm:inline-flex"
            href={whatsappUrl("Hi Yatreo, I'd love help planning a trip.")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} />
            <span>Chat with a planner</span>
          </a>
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="rounded-full border border-sand p-2.5 text-teal md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav
          className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-sand bg-cream px-5 py-4 shadow-xl md:hidden"
          aria-label="Mobile navigation"
        >
          <NavLink
            aria-current={destinationsActive ? "page" : undefined}
            className={({ isActive }) => `mobile-nav-link${isActive ? " active" : ""}`}
            onClick={closeMenu}
            to="/destinations"
          >
            Destinations
          </NavLink>
          <Link aria-current={packagesActive ? "location" : undefined} className={`mobile-nav-link${packagesActive ? " active" : ""}`} onClick={closeMenu} to="/#packages">
            Packages
          </Link>
          <Link aria-current={aboutActive ? "location" : undefined} className={`mobile-nav-link${aboutActive ? " active" : ""}`} onClick={closeMenu} to="/#about">
            About
          </Link>
          <Link aria-current={contactActive ? "location" : undefined} className={`mobile-nav-link${contactActive ? " active" : ""}`} onClick={closeMenu} to="/#contact">
            Contact
          </Link>
          <a
            className="mobile-nav-link text-teal"
            href={whatsappUrl("Hi Yatreo, I'd love help planning a trip.")}
            rel="noreferrer"
            target="_blank"
            onClick={closeMenu}
          >
            Chat with a planner <ArrowUpRight size={17} />
          </a>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-deep text-white">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:py-[4.5rem]">
        <div>
          <Logo onDark />
          <p className="mt-5 max-w-xs font-display text-xl leading-7 text-cream">
            Every yatra, your story.
          </p>
        </div>
        <div>
          <h3 className="footer-heading">Find your yatra</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/65">
            <Link to="/destinations">All destinations</Link>
            <a href="/#packages">Packages</a>
            <Link to="/destinations/kerala">Kerala</Link>
            <Link to="/destinations/ladakh">Ladakh</Link>
            <Link to="/destinations/rajasthan">Rajasthan</Link>
          </div>
        </div>
        <div>
          <h3 className="footer-heading">Good to know</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/65">
            <a href="/#our-way">About Yatreo</a>
            <span>Terms &amp; Conditions</span>
            <span>Privacy Policy</span>
            <span>Cancellation &amp; Refund</span>
          </div>
        </div>
        <div id="contact">
          <h3 className="footer-heading">Talk to a human</h3>
          <p className="mt-4 text-sm leading-6 text-white/65">
            Big plans, small questions, or nowhere picked yet. We’re here.
          </p>
          <a
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold"
            href={whatsappUrl("Hi Yatreo, I'd love to plan a trip.")}
            rel="noreferrer"
            target="_blank"
          >
            [PHONE / WHATSAPP] <ArrowUpRight size={16} />
          </a>
          <p className="mt-3 text-xs text-white/55">[EMAIL] · [DOMAIN]</p>
        </div>
        <div className="border-t border-white/15 pt-5 text-xs text-white/45 sm:col-span-2 lg:col-span-4">
          © {new Date().getFullYear()} Yatreo. Thoughtfully going places.
        </div>
      </div>
    </footer>
  );
}

function SiteLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <a
      aria-label="Chat with a real person on WhatsApp"
      className="whatsapp-float"
        href={whatsappUrl("Hi Yatreo, I'd love help planning a trip.")}
        rel="noreferrer"
        target="_blank"
      >
      <MessageCircle aria-hidden="true" size={21} />
      <span className="whatsapp-float-copy">
        <span className="whatsapp-float-title">Chat with a real person</span>
        <span className="whatsapp-float-status"><i /> Usually replies within [RESPONSE TIME]</span>
      </span>
      </a>
    </>
  );
}

function Eyebrow({ children, light = false }) {
  return (
    <div className={`eyebrow ${light ? "eyebrow-light" : ""}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </div>
  );
}

function SearchBar({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/destinations${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  }

  return (
    <form className="search-bar" onSubmit={submitSearch} role="search">
      <MapPin className="shrink-0 text-teal" size={20} />
      <label className="sr-only" htmlFor="destination-search">
        Where would you like to go?
      </label>
      <input
        autoComplete="off"
        id="destination-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Where would you like to go?"
        type="search"
        value={query}
      />
      <span className="hidden h-8 w-px bg-sand sm:block" />
      <span className="hidden text-sm text-muted md:block">India & beyond</span>
      <button aria-label="Search destinations" className="button-teal search-submit" type="submit">
        <Search size={17} className="sm:hidden" />
        <span className="hidden sm:inline">Find my place</span>
        <ArrowRight className="hidden sm:block" size={16} />
      </button>
    </form>
  );
}

function ImageCard({ destination, className = "" }) {
  return (
    <Link
      aria-label={`Explore ${destination.name}`}
      className={`image-card group ${className}`}
      to={`/destinations/${destination.slug}`}
    >
      <img
        alt={`${destination.name} — ${destination.state}`}
        className="image-card-photo"
        loading="lazy"
        src={destination.image}
      />
      <div className="image-card-gradient" />
      <span className="image-card-pill">
        {destination.label}
      </span>
      <span className="image-card-copy">
        <span className="flex items-center gap-1 text-xs font-medium text-white/80">
          <MapPin size={13} /> {destination.state}
        </span>
        <span className="mt-1 font-display text-[1.75rem] font-semibold leading-tight">
          {destination.name}
        </span>
        <span className="image-card-link">[N] trips</span>
      </span>
      <span className="image-card-arrow" aria-hidden="true">
        <ArrowUpRight size={17} />
      </span>
    </Link>
  );
}

function SectionHeading({ eyebrow, title, description, linkTo }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end lg:mb-10">
      <div className="max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="section-title mt-3">{title}</h2>
        {description && <p className="section-description mt-3">{description}</p>}
      </div>
      {linkTo && (
        <Link className="text-link shrink-0" to={linkTo}>
          See all destinations <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

function HomePage() {
  const favourites = ["kerala", "ladakh", "rajasthan", "goa", "himachal", "bali"]
    .map((slug) => destinations.find((destination) => destination.slug === slug))
    .filter(Boolean);

  return (
    <main>
      <section className="hero-section">
        <div className="hero-sun" aria-hidden="true" />
        <div aria-hidden="true" className="hero-flight-path"><Plane size={18} /></div>
        <div className="hero-inner">
          <div className="hero-content">
            <Eyebrow>Holiday packages</Eyebrow>
            <h1 className="hero-title">
              Every yatra,
              <br />
              <span>your story.</span>
            </h1>
            <p className="hero-description">
              Holidays, handled. Tell us where you want to go, and a real person
              plans the rest with you on WhatsApp.
            </p>
            <TripPlanner />
          </div>
          <div className="hero-visual">
            <img
              alt="A quiet Kerala backwater, framed by coconut palms at golden hour"
              className="hero-photo"
              fetchpriority="high"
              src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1300&q=90"
            />
            <div className="hero-stamp" aria-label="Signature journey: Slow Mornings, Kerala">
              <span className="font-accent text-lg">यात्रा</span>
              <span>Slow mornings</span>
              <span>Kerala · Since always</span>
            </div>
            <p className="hero-caption">Vembanad backwaters <span>·</span> Kerala</p>
          </div>
        </div>
        <WaveDivider />
      </section>

      <section className="trust-bar" aria-label="What makes Yatreo different">
        <div className="mx-auto grid max-w-[1240px] gap-5 px-5 py-6 sm:px-8 lg:grid-cols-4 lg:py-7">
          <TrustItem icon={MessageCircle} title="A real person on WhatsApp" />
          <TrustItem icon={Check} title="Clear inclusions, no hidden costs" />
          <TrustItem icon={Heart} title="Plans built around you" />
          <TrustItem icon={ShieldCheck} title="Support before and during your trip" />
        </div>
      </section>

      <section className="section-shell" id="discover">
        <SectionHeading
          description="Six lovely places to start with. And a real person ready to help you find the one you do."
          eyebrow="Stamp your passport"
          linkTo="/destinations"
          title="A little bit of India & beyond."
        />
        <div className="destination-stamp-grid">
          {favourites.map((destination, index) => (
            <ImageCard
              className={index === 0 ? "destination-tile destination-tile-featured" : "destination-tile"}
              destination={destination}
              key={destination.slug}
            />
          ))}
        </div>
      </section>

      <section className="section-shell section-tint" id="packages">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHeading
            description="A few well-loved ways to go. Each one thoughtfully planned, and always made your own."
            eyebrow="Curated boarding passes"
            linkTo="/packages"
            title="Choose your kind of journey."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {featuredTrips.map(({ slug, mood, route, code, imagePosition }, index) => {
              const destination = destinations.find((place) => place.slug === slug);
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

      <HowItWorks />
      <OffersBand />
      <Testimonials />
      <ClosingBand />
      <WhyYatreo />
    </main>
  );
}

function TripPlanner() {
  const [where, setWhere] = useState("");
  const [when, setWhen] = useState("");
  const [who, setWho] = useState("2 travellers");
  const message = `Hi Yatreo! Chalo, let's plan it.\n\nWhere: ${where || "Still deciding"}\nWhen: ${when || "I'm flexible"}\nWho: ${who}\n\nCould you help me plan a thoughtful trip?`;

  return (
    <form
      className="trip-planner"
      onSubmit={(event) => {
        event.preventDefault();
        window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
      }}
    >
      <div className="trip-planner-fields">
        <label className="planner-field">
          <span><MapPin size={16} /> Where</span>
          <select onChange={(event) => setWhere(event.target.value)} value={where}>
            <option value="">Surprise me</option>
            {destinations.map((destination) => (
              <option key={destination.slug} value={destination.name}>{destination.name}</option>
            ))}
          </select>
        </label>
        <label className="planner-field">
          <span><CalendarDays size={16} /> When</span>
          <select onChange={(event) => setWhen(event.target.value)} value={when}>
            <option value="">I’m flexible</option>
            <option>In the next month</option>
            <option>In 1–3 months</option>
            <option>In 3–6 months</option>
            <option>I have dates in mind</option>
          </select>
        </label>
        <label className="planner-field">
          <span><Users size={16} /> Who</span>
          <select onChange={(event) => setWho(event.target.value)} value={who}>
            <option>Just me</option>
            <option>2 travellers</option>
            <option>Family</option>
            <option>Friends</option>
          </select>
        </label>
        <button className="button-gold planner-submit" type="submit">
          <MessageCircle size={17} /> Plan my trip
        </button>
      </div>
      <div aria-live="polite" className="planner-preview">
        <MessageCircle size={15} />
        <span>{message.split("\n").filter(Boolean).join(" · ")}</span>
      </div>
    </form>
  );
}

function WaveDivider() {
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

function BoardingPass({ code, destination, duration, imagePosition, mood, route }) {
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
          <span className="boarding-pass-route">{route} <span>·</span> {code}</span>
          <h3>{mood}: {destination.name}</h3>
          <p>{duration} <span>·</span> {destination.state}</p>
        </div>
      </Link>
      <div className="boarding-pass-stub">
        <span className="boarding-pass-price-label">A little getaway from</span>
        <p>₹[YOUR PRICE] <span>per person</span></p>
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

function HowItWorks() {
  const steps = [
    { number: "01", title: "Pick a trip", text: "Find a place or a feeling that makes you want to pack a bag.", icon: Compass },
    { number: "02", title: "Chat with us on WhatsApp", text: "A real person helps turn your ideas into a thoughtful plan.", icon: MessageCircle },
    { number: "03", title: "Pack and go", text: "The details are handled. All that’s left is the lovely part.", icon: Plane },
  ];

  return (
    <section className="section-shell" id="our-way">
      <div className="mx-auto max-w-[1240px]">
        <SectionHeading
          eyebrow="Chalo, let’s plan it"
          title="Three little steps. One big yatra."
          description="The Road to your next trip is a little easier with someone by your side."
        />
        <div className="road-steps">
          {steps.map(({ number, title, text, icon: Icon }) => (
            <article className="step-card" key={number}>
              <span className="road-stop">{number === "01" ? <Plane size={15} /> : <span>{number}</span>}</span>
              <span className="step-icon"><Icon size={22} strokeWidth={1.8} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OffersBand() {
  return (
    <section className="offers-band">
      <WaveDivider />
      <div className="offers-content">
        <Eyebrow light>A little something extra</Eyebrow>
        <div className="offers-card">
          <span className="offers-sun" aria-hidden="true" />
          <div className="relative">
            <span className="offers-kicker">For the next chapter</span>
            <h2>[OFFER NAME]</h2>
            <p>[OFFER DETAILS]</p>
          </div>
          <a
            className="button-gold min-h-12 gap-2 px-6"
            href={whatsappUrl("Hi Yatreo, tell me about your current offers.")}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle size={16} /> Ask us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  { name: "Ananya", city: "Bengaluru", trip: "Slow Mornings: Kerala", quote: "Sample testimonial: The whole trip felt like it was made just for us. We could actually slow down and enjoy being together." },
  { name: "Rohan", city: "Mumbai", trip: "Big Adventures: Ladakh", quote: "Sample testimonial: Every detail was thought through. Having a real person to call made the mountains feel a little less far away." },
  { name: "Meera", city: "Pune", trip: "Heritage Trails: Rajasthan", quote: "Sample testimonial: We found the little places we would have missed on our own. Planning felt as good as the holiday." },
];

function Testimonials() {
  return (
    <section className="section-shell testimonials-section" id="our-stories">
      <SectionHeading
        description="A few kind words from the road. These are sample testimonials, ready to be replaced with real traveller stories."
        eyebrow="Postcards from the road"
        title="The best part is the feeling you bring home."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.name}>
            <Quote aria-hidden="true" className="testimonial-quote" size={32} />
            <p className="testimonial-copy">{testimonial.quote}</p>
            <div className="testimonial-footer">
              <span className="testimonial-person">{testimonial.name} <span>· {testimonial.city}</span></span>
              <span className="testimonial-trip">{testimonial.trip}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ClosingBand() {
  return (
    <section className="closing-band">
      <div className="closing-inner">
        <div>
          <Eyebrow>Not sure where to start?</Eyebrow>
          <h2>Tell us who’s travelling. We’ll suggest a plan.</h2>
        </div>
        <a
          className="button-teal min-h-12 gap-2 px-6"
          href={whatsappUrl("Hi Yatreo! I'm not sure where to go. Could you suggest a trip for us?")}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle size={16} /> Chat with us on WhatsApp
        </a>
      </div>
    </section>
  );
}

function WhyYatreo() {
  const reasons = [
    { icon: Heart, title: "Made around you", text: "Your pace, your people, your kind of trip. Never a copy-paste itinerary." },
    { icon: Leaf, title: "Locally considered", text: "The lovely small places, responsible stays, and quieter roads matter to us." },
    { icon: ShieldCheck, title: "There when it counts", text: "A friendly human to help before your trip, during it, and on the way home." },
  ];

  return (
    <section className="section-shell pt-2" id="about">
      <div className="why-panel">
        <div className="max-w-[510px]">
          <Eyebrow light>The good kind of different</Eyebrow>
          <h2 className="mt-3 font-display text-[2rem] font-semibold leading-tight text-white sm:text-[2.7rem]">
            Good travel feels like it was meant for you.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/70 sm:text-base">
            No fuss, no surprises. Just people who care about where you go —
            and how you feel when you get there.
          </p>
          <a
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-deep transition hover:bg-[#ffd07e]"
            href={whatsappUrl("Hi Yatreo, tell me more about planning a trip.")}
            rel="noreferrer"
            target="_blank"
          >
            Come say hello <ArrowRight size={16} />
          </a>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3 lg:mt-0 lg:max-w-[560px]">
          {reasons.map(({ icon: Icon, title, text }) => (
            <div className="flex gap-3 sm:flex-col" key={title}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold">
                <Icon size={19} />
              </span>
              <div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DestinationCard({ destination }) {
  return (
    <Link className="destination-card group" to={`/destinations/${destination.slug}`}>
      <div className="destination-card-photo">
        <img
          alt={`${destination.name}, ${destination.state}`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]"
          loading="lazy"
          src={destination.image}
        />
        <span className="absolute left-3 top-3 rounded-full border border-white/45 bg-white/90 px-3 py-1 text-[0.67rem] font-semibold uppercase tracking-[0.1em] text-teal backdrop-blur">
          {destination.region}
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 text-teal">
          <ArrowUpRight size={17} />
        </span>
      </div>
      <div className="flex items-start justify-between gap-3 px-1 pt-4">
        <div>
          <h2 className="font-display text-[1.4rem] font-semibold leading-tight text-ink">
            {destination.name}
          </h2>
          <p className="mt-1 text-sm text-muted">{destination.state}</p>
        </div>
        <span className="mt-1 flex items-center gap-1 text-sm font-medium text-ink">
          <Star className="fill-gold text-gold" size={14} /> {destination.rating}
        </span>
      </div>
      <div className="flex items-center justify-between px-1 pb-1 pt-3">
        <span className="text-xs text-muted">{destination.duration}</span>
        <span className="text-sm font-semibold text-teal">
          from {destination.price}
        </span>
      </div>
    </Link>
  );
}

function ExplorePage() {
  const params = new URLSearchParams(window.location.search);
  const [query, setQuery] = useState(params.get("q") || "");
  const [region, setRegion] = useState("All regions");
  const [budget, setBudget] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtered = destinations.filter((destination) => {
    const matchesText = `${destination.name} ${destination.state} ${destination.region} ${destination.label}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesRegion =
      region === "All regions" || destination.region.toLowerCase() === region.toLowerCase();
    const amount = Number(destination.price.replace(/[^\d]/g, ""));
    const matchesBudget = !budget || (budget === "under" ? amount < 25000 : amount >= 25000);
    return matchesText && matchesRegion && matchesBudget;
  });
  const filterCount = Number(region !== "All regions") + Number(Boolean(budget));
  const clearFilters = () => {
    setQuery("");
    setRegion("All regions");
    setBudget("");
  };

  return (
    <main className="min-h-[70vh]">
      <section className="explore-intro">
        <div className="mx-auto max-w-[1240px] px-5 pt-12 sm:px-8 sm:pt-16 lg:pt-[4.5rem]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <Link className="transition hover:text-teal" to="/">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-teal">Destinations</span>
          </div>
          <div className="mt-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Eyebrow>Destinations</Eyebrow>
              <h1 className="mt-3 font-display text-[2.65rem] font-semibold leading-tight tracking-[-0.045em] text-teal sm:text-[3.5rem]">
                Where to next?
              </h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-muted">
                For the long weekends, the once-in-a-whiles, and the trips you
                haven’t quite dreamed up yet.
              </p>
            </div>
            <span className="mb-1 inline-flex items-center gap-2 text-sm text-muted">
              <span className="h-2 w-2 rounded-full bg-[#16836e]" />
              {destinations.length} thoughtfully picked places
            </span>
          </div>
          <div className="mt-8 max-w-2xl">
            <label className="search-bar search-bar-light">
              <MapPin className="shrink-0 text-teal" size={19} />
              <span className="sr-only">Search places, regions, or experiences</span>
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a place, region, or feeling..."
                type="search"
                value={query}
              />
              <Search className="hidden text-teal sm:block" size={19} />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 pb-8">
            {regions.map((item) => (
              <button
                aria-pressed={region === item}
                className={`filter-chip ${region === item ? "filter-chip-active" : ""}`}
                key={item}
                onClick={() => setRegion(item)}
                type="button"
              >
                {item}
              </button>
            ))}
            <button
              aria-expanded={filtersOpen}
              className={`filter-chip ml-0 inline-flex items-center gap-2 sm:ml-auto ${filtersOpen ? "border-teal text-teal" : ""}`}
              onClick={() => setFiltersOpen((open) => !open)}
              type="button"
            >
              Filters {filterCount > 0 && <span className="filter-count">{filterCount}</span>}
              <ChevronDown className={`transition ${filtersOpen ? "rotate-180" : ""}`} size={14} />
            </button>
          </div>
          {filtersOpen && (
            <div className="border-t border-sand pb-6 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                A little about your budget
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  ["under", "Under ₹25k"],
                  ["over", "₹25k & above"],
                ].map(([value, label]) => (
                  <button
                    aria-pressed={budget === value}
                    className={`filter-chip ${budget === value ? "filter-chip-active" : ""}`}
                    key={value}
                    onClick={() => setBudget((current) => current === value ? "" : value)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
                {filterCount > 0 && (
                  <button
                    className="px-3 py-2 text-xs font-semibold text-teal underline underline-offset-4"
                    onClick={clearFilters}
                    type="button"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-muted" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "place" : "places"} to fall for
          </p>
          <span className="hidden text-xs text-muted sm:block">Good things take the scenic route.</span>
        </div>
        {filtered.length > 0 ? (
          <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((destination) => (
              <DestinationCard destination={destination} key={destination.slug} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-sand bg-white/55 px-6 text-center">
            <Compass className="text-teal/55" size={32} strokeWidth={1.5} />
            <h2 className="mt-4 font-display text-2xl font-semibold text-teal">
              Nothing quite like that (yet).
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
              Try a different place or region, or start fresh and see what calls to you.
            </p>
            <button className="button-teal mt-5 px-5" onClick={clearFilters} type="button">
              See all destinations
            </button>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1240px] px-5 pb-14 sm:px-8 sm:pb-20">
        <div className="planner-card">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gold">
              <MessageCircle size={19} />
            </span>
            <h2 className="mt-4 font-display text-[1.75rem] font-semibold leading-tight text-white sm:text-3xl">
              Can’t decide where to go?
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Tell us what you’re in the mood for. We know someone who knows a place.
            </p>
            <a
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-deep transition hover:bg-[#ffd07e]"
              href={whatsappUrl("Hi Yatreo, help me find a destination for my next trip.")}
              rel="noreferrer"
              target="_blank"
            >
              Talk to a real planner <ArrowRight size={16} />
            </a>
          </div>
          <div aria-hidden="true" className="planner-decoration">
            <Compass size={185} strokeWidth={0.65} />
          </div>
        </div>
      </section>
    </main>
  );
}

function DestinationPage() {
  const { slug } = useParams();
  const destination = destinations.find((place) => place.slug === slug);

  if (!destination) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <Compass className="text-teal/55" size={34} />
        <h1 className="mt-4 font-display text-3xl font-semibold text-teal">That way’s still a mystery.</h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">
          We haven’t added this destination just yet, but there are plenty of other lovely places.
        </p>
        <Link className="button-teal mt-5 px-5" to="/destinations">
          Explore all destinations
        </Link>
      </main>
    );
  }

  const related = destinations.filter((place) => place.slug !== destination.slug).slice(0, 3);

  return (
    <main>
      <section className="destination-hero">
        <img
          alt={`${destination.name}, ${destination.state}`}
          className="destination-hero-image"
          fetchpriority="high"
          src={destination.image.replace("w=1400", "w=2200")}
        />
        <div className="destination-hero-shade" />
        <div className="destination-hero-content">
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/75">
            <Link className="transition hover:text-gold" to="/">
              Home
            </Link>
            <span>/</span>
            <Link className="transition hover:text-gold" to="/destinations">
              Destinations
            </Link>
            <span>/</span>
            <span className="font-medium text-white">{destination.name}</span>
          </div>
          <span className="mt-9 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.13em] text-white backdrop-blur">
            <MapPin size={14} /> {destination.region} India
          </span>
          <h1 className="mt-5 font-display text-[3.5rem] font-semibold leading-[0.99] tracking-[-0.05em] text-white sm:text-[5.5rem]">
            {destination.name}
          </h1>
          <p className="mt-3 font-display text-xl italic text-white/85 sm:text-[1.65rem]">
            {destination.state}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
            {destination.description}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              className="button-gold min-h-[48px] gap-2 px-6"
              href={whatsappUrl(`Hi Yatreo, I'd love to plan a trip to ${destination.name}.`)}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle size={17} /> Plan my {destination.name} trip
            </a>
            <a
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/40 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              href="#the-journey"
            >
              Explore the journey <ArrowDown size={16} />
            </a>
          </div>
        </div>
        <div className="absolute bottom-6 right-6 hidden items-center gap-2 text-xs text-white/80 sm:flex">
          <Star className="fill-gold text-gold" size={15} /> Loved by travellers · {destination.rating}/5
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 sm:py-16" id="the-journey">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.78fr] lg:gap-16">
          <div>
            <Eyebrow>A place to feel, not just see</Eyebrow>
            <h2 className="mt-3 max-w-2xl font-display text-[2.15rem] font-semibold leading-tight tracking-[-0.03em] text-teal sm:text-[3rem]">
              {destination.name}, at your own pace.
            </h2>
            <p className="mt-4 max-w-xl text-[0.94rem] leading-7 text-muted">
              {destination.description} We’ll help you find the right mix of
              much-loved classics and little local moments, without making
              every day feel like a checklist.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {destination.highlights.map((highlight) => (
                <span className="inline-flex items-center gap-2 rounded-full bg-[#f2ede3] px-4 py-2 text-xs font-medium text-teal" key={highlight}>
                  <Check size={14} /> {highlight}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 self-start">
            <div className="rounded-2xl bg-[#f4ede1] p-5 sm:p-6">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
                Lovely time to go
              </span>
              <p className="mt-3 font-display text-lg font-semibold leading-snug text-teal">
                {destination.season}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f4ede1] p-5 sm:p-6">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
                Make room for it
              </span>
              <p className="mt-3 font-display text-lg font-semibold leading-snug text-teal">
                {destination.duration}
              </p>
            </div>
            <div className="col-span-2 flex items-center justify-between rounded-2xl bg-teal p-5 text-white sm:p-6">
              <div>
                <span className="text-xs font-medium uppercase tracking-[0.1em] text-white/65">
                  Thoughtful trips from
                </span>
                <p className="mt-2 font-display text-2xl font-semibold">{destination.price}</p>
                <p className="mt-1 text-xs text-white/65">per person · tailored to your trip</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-gold">
                <Sparkles size={21} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tint py-12 sm:py-16">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHeading
            description={`Places, people, and unhurried moments that make a trip to ${destination.name} feel like yours.`}
            eyebrow={`The rhythm of ${destination.name}`}
            title="A few lovely places along the way."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {destination.highlights.map((highlight, index) => (
              <article className="experience-card" key={highlight}>
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 font-display text-lg text-teal">
                  0{index + 1}
                </span>
                <h3 className="font-display text-xl font-semibold text-ink">{highlight}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  There’s time to find the view, linger a little, and take the road locals would take.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid items-center gap-6 overflow-hidden rounded-[26px] bg-[#f2ede3] p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:px-12 lg:py-10">
          <div className="max-w-2xl">
            <Eyebrow>Your trip, the way you imagined it</Eyebrow>
            <h2 className="mt-3 font-display text-[1.85rem] font-semibold leading-tight text-teal sm:text-[2.45rem]">
              Planning {destination.name}? Let’s make it personal.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Tell a human planner what you have in mind. We’ll take it from there —
              one thoughtful detail at a time.
            </p>
          </div>
          <a
            className="button-teal min-h-[48px] gap-2 px-5"
            href={whatsappUrl(`Hi Yatreo, I'd like to plan a trip to ${destination.name}.`)}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle size={16} /> Chat about {destination.name}
          </a>
        </div>
      </section>

      <section className="section-tint py-12 sm:py-16">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="Keep wandering"
            linkTo="/destinations"
            title="A few more places to fall for."
          />
          <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((place) => <DestinationCard destination={place} key={place.slug} />)}
          </div>
        </div>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <Compass className="text-teal/55" size={34} />
      <h1 className="mt-4 font-display text-3xl font-semibold text-teal">Looks like a scenic detour.</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
        That page isn’t here, but there’s always somewhere lovely to go next.
      </p>
      <Link className="button-teal mt-5 px-5" to="/">
        <ArrowLeft size={16} /> Find your way home
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<ExplorePage />} path="/destinations" />
        <Route element={<ExplorePage />} path="/packages" />
        <Route element={<DestinationPage />} path="/destinations/:slug" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </SiteLayout>
  );
}
