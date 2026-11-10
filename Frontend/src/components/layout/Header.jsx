import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Heart, LogOut, Menu, MessageCircle, Shield, Sparkles, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { whatsappUrl } from "../../data/destinations";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!hash) return;
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [pathname, hash]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e1d5]/80 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[62px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          <NavLink
            className={({ isActive }) => `nav-link text-[14px]${isActive ? " active" : ""}`}
            to="/destinations"
          >
            Destinations
          </NavLink>
          <NavLink
            className={({ isActive }) => `nav-link text-[14px]${isActive ? " active" : ""}`}
            to="/packages"
          >
            Packages
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav-link inline-flex items-center gap-1.5 text-[14px]${isActive ? " active" : ""}`
            }
            to="/plan"
          >
            <span>Trip Planner</span>
            <span className="rounded-full bg-warm/25 px-1.5 py-0.5 text-[10px] font-bold uppercase text-warm-dark">
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
              className="relative hidden items-center gap-1 rounded-full border border-sand bg-white/80 px-2.5 py-1 text-xs font-semibold text-ink transition hover:border-rose-300 sm:flex"
              to="/destinations"
            >
              <Heart className="fill-rose-500 text-rose-500" size={13} />
              <span>{wishlistCount} Saved</span>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                className="hidden items-center gap-1.5 rounded-full bg-sand/60 px-3 py-1 text-xs font-medium text-ink transition-colors hover:bg-sand md:flex"
                to="/dashboard"
              >
                <User className="text-teal" size={14} />
                <span>{user.full_name || user.username}</span>
              </Link>

              {isAdmin && (
                <Link
                  className="flex items-center gap-1 rounded-full bg-warm/20 px-2.5 py-1 text-xs font-semibold text-warm-dark hover:bg-warm/30"
                  to="/admin"
                >
                  <Shield size={13} />
                  <span>Admin</span>
                </Link>
              )}

              <button
                aria-label="Log out"
                className="rounded-full p-1.5 text-muted transition-colors hover:bg-sand/60 hover:text-ink"
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
              className="rounded-full border border-teal/20 px-3.5 py-1 text-xs font-medium text-teal transition-all hover:bg-teal hover:text-cream"
              to="/login"
            >
              Sign In
            </Link>
          )}

          <a
            className="hidden items-center gap-1.5 rounded-full bg-teal px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cream shadow-sm transition-all hover:bg-teal-hover md:inline-flex"
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
            className="rounded-full p-2 text-ink lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="border-b border-[#e9e1d5] bg-cream px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
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
