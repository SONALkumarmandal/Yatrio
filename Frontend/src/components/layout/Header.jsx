import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Heart, LogOut, Menu, MessageCircle, Shield, Sparkles, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { whatsappUrl } from "../../data/destinations";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();

  const closeMenu = () => setMenuOpen(false);
  const isDestinationDetail = /^\/destinations\/[^/]+$/.test(pathname.replace(/\/$/, ""));
  const isOverlay = isDestinationDetail && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (!hash) return;
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [pathname, hash]);

  return (
    <header
      className={`${
        isDestinationDetail ? "fixed left-0 right-0 top-0" : "sticky top-0"
      } z-50 transition-all duration-300 ${
        isOverlay
          ? "border-b border-white/10 bg-gradient-to-b from-black/55 via-black/25 to-transparent"
          : "border-b border-[#e9e1d5]/80 bg-cream/95 backdrop-blur-xl shadow-2xs"
      }`}
    >
      <div className="mx-auto flex h-[62px] max-w-[1240px] items-center justify-between gap-2 px-4 sm:px-5 lg:px-8">
        <Logo onDark={isOverlay} />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          <NavLink
            className={({ isActive }) =>
              `nav-link ${isOverlay ? "nav-link-overlay" : ""} text-[14px]${isActive ? " active" : ""}`
            }
            to="/destinations"
          >
            Destinations
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav-link ${isOverlay ? "nav-link-overlay" : ""} text-[14px]${isActive ? " active" : ""}`
            }
            to="/packages"
          >
            Packages
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav-link ${isOverlay ? "nav-link-overlay" : ""} inline-flex items-center gap-1.5 text-[14px]${isActive ? " active" : ""}`
            }
            to="/plan"
          >
            <span>Trip Planner</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                isOverlay ? "bg-gold text-deep" : "bg-warm/25 text-warm-dark"
              }`}
            >
              Custom
            </span>
          </NavLink>
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5">
          {/* Wishlist Link */}
          {wishlistCount > 0 && (
            <Link
              aria-label={`View ${wishlistCount} saved trips`}
              className={`relative hidden items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition sm:flex ${
                isOverlay
                  ? "border-white/25 bg-black/30 text-white backdrop-blur-md hover:border-gold"
                  : "border-sand bg-white/80 text-ink hover:border-rose-300"
              }`}
              to="/destinations"
            >
              <Heart className="fill-rose-500 text-rose-500" size={13} />
              <span>{wishlistCount} Saved</span>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                className={`hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors md:flex ${
                  isOverlay
                    ? "border border-white/25 bg-black/30 text-white backdrop-blur-md hover:bg-white/20"
                    : "bg-sand/60 text-ink hover:bg-sand"
                }`}
                to="/dashboard"
              >
                <User className={isOverlay ? "text-gold" : "text-teal"} size={14} />
                <span>{user.full_name || user.username}</span>
              </Link>

              {isAdmin && (
                <Link
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                    isOverlay
                      ? "border border-gold/40 bg-gold/25 text-gold backdrop-blur-md hover:bg-gold/35"
                      : "bg-warm/20 text-warm-dark hover:bg-warm/30"
                  }`}
                  to="/admin"
                >
                  <Shield size={13} />
                  <span>Admin</span>
                </Link>
              )}

              <button
                aria-label="Log out"
                className={`rounded-full p-1.5 transition-colors ${
                  isOverlay
                    ? "text-white/85 hover:bg-white/15 hover:text-white"
                    : "text-muted hover:bg-sand/60 hover:text-ink"
                }`}
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              className={`rounded-full border px-3.5 py-1 text-xs font-medium transition-all ${
                isOverlay
                  ? "border-white/40 bg-black/20 text-white backdrop-blur-md hover:bg-white hover:text-teal"
                  : "border-teal/20 text-teal hover:bg-teal hover:text-cream"
              }`}
              to="/login"
            >
              Sign In
            </Link>
          )}

          <a
            className={`hidden items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider shadow-sm transition-all md:inline-flex ${
              isOverlay
                ? "border border-white/25 bg-teal/90 text-cream backdrop-blur-md hover:bg-teal"
                : "bg-teal text-cream hover:bg-teal-hover"
            }`}
            href={whatsappUrl("Hi Yatreo! I’d like to plan a holiday.")}
            rel="noopener noreferrer"
            target="_blank"
          >
            <MessageCircle size={14} />
            <span>Plan on WhatsApp</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            className={`rounded-full p-2 lg:hidden ${isOverlay ? "text-white" : "text-ink"}`}
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="max-h-[calc(100vh-62px)] overflow-y-auto border-b border-[#e9e1d5] bg-cream px-5 py-5 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-3">
            <Link className="text-base font-medium text-ink" onClick={closeMenu} to="/destinations">
              Destinations
            </Link>
            <Link className="text-base font-medium text-ink" onClick={closeMenu} to="/packages">
              Packages
            </Link>
            <Link className="text-base font-medium text-teal flex items-center justify-between" onClick={closeMenu} to="/plan">
              <span>Custom Trip Builder</span>
              <span className="rounded-full bg-warm/25 px-2 py-0.5 text-[10px] font-bold uppercase text-warm-dark">
                Custom
              </span>
            </Link>

            {wishlistCount > 0 && (
              <Link className="flex items-center gap-1.5 text-sm font-semibold text-rose-600" onClick={closeMenu} to="/destinations">
                <Heart className="fill-rose-500" size={14} />
                <span>Saved Trips ({wishlistCount})</span>
              </Link>
            )}

            {user ? (
              <>
                <hr className="my-1 border-sand" />
                <Link className="text-base font-medium text-teal" onClick={closeMenu} to="/dashboard">
                  My Dashboard ({user.username})
                </Link>
                {isAdmin && (
                  <Link className="text-base font-medium text-warm-dark" onClick={closeMenu} to="/admin">
                    Admin Portal
                  </Link>
                )}
                <button
                  className="text-left text-sm text-muted"
                  onClick={async () => {
                    await logout();
                    closeMenu();
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <Link className="text-base font-medium text-teal" onClick={closeMenu} to="/login">
                Sign In / Register
              </Link>
            )}

            <a
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-teal py-3 text-xs font-semibold uppercase tracking-wider text-cream"
              href={whatsappUrl("Hi Yatreo! I’d like to plan a holiday.")}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle size={16} /> Plan on WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
