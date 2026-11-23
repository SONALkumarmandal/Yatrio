import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import * as favoritesApi from "../services/favoritesApi";

const WishlistContext = createContext(null);
const GUEST_WISHLIST_KEY = "yatreo_wishlist:guest";

function readGuestFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((destination) => destination?.slug) : [];
  } catch (err) {
    console.warn("Could not read guest favorites:", err);
    return [];
  }
}

export function WishlistProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [loadedFor, setLoadedFor] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const activeUserId = useRef(user?.id ?? null);
  activeUserId.current = user?.id ?? null;
  const currentUserId = user?.id ?? null;
  const visibleDestinations =
    !authLoading && loadedFor === currentUserId ? savedDestinations : [];

  useEffect(() => {
    localStorage.removeItem("yatreo_wishlist");
  }, []);

  useEffect(() => {
    if (authLoading) return undefined;

    let active = true;
    setError("");

    if (!user) {
      setSavedDestinations(readGuestFavorites());
      setLoadedFor(null);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setSavedDestinations([]);
    setLoadedFor(user.id);
    setLoading(true);
    favoritesApi
      .getFavorites()
      .then((favorites) => {
        if (active && activeUserId.current === user.id) setSavedDestinations(favorites);
      })
      .catch((err) => {
        if (!active || activeUserId.current !== user.id) return;
        console.error("Could not load user favorites:", err);
        setError(`Could not load saved journeys: ${err.message}`);
      })
      .finally(() => {
        if (active && activeUserId.current === user.id) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, user?.id]);

  async function toggleWishlist(slug, destination) {
    if (!slug || authLoading || loading) return;
    setError("");
    const isCurrentlySaved = savedDestinations.some((item) => item.slug === slug);

    if (user) {
      const requestUserId = user.id;
      try {
        if (isCurrentlySaved) {
          await favoritesApi.removeFavorite(slug);
          if (activeUserId.current !== requestUserId) return;
          setSavedDestinations((items) => items.filter((item) => item.slug !== slug));
        } else {
          await favoritesApi.addFavorite(slug);
          if (activeUserId.current !== requestUserId) return;
          if (destination) {
            setSavedDestinations((items) =>
              items.some((item) => item.slug === slug) ? items : [...items, destination]
            );
          } else {
            const favorites = await favoritesApi.getFavorites();
            if (activeUserId.current !== requestUserId) return;
            setSavedDestinations(favorites);
          }
        }
      } catch (err) {
        if (activeUserId.current !== requestUserId) return;
        console.error("Could not update user favorites:", err);
        setError(`Could not update saved journeys: ${err.message}`);
      }
      return;
    }

    if (!destination) return;
    const next = isCurrentlySaved
      ? savedDestinations.filter((item) => item.slug !== slug)
      : [...savedDestinations, destination];
    try {
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(next));
      setSavedDestinations(next);
    } catch (err) {
      console.error("Could not save guest favorites:", err);
      setError("Could not save this journey in this browser.");
    }
  }

  function isSaved(slug) {
    return visibleDestinations.some((destination) => destination.slug === slug);
  }

  return (
    <WishlistContext.Provider
      value={{
        savedSlugs: visibleDestinations.map((destination) => destination.slug),
        savedDestinations: visibleDestinations,
        toggleWishlist,
        isSaved,
        count: visibleDestinations.length,
        loading: authLoading || loading || loadedFor !== currentUserId,
      }}
    >
      {error && (
        <div
          className="fixed bottom-4 right-4 z-[100] max-w-sm rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg"
          role="alert"
        >
          {error}
          <button
            className="ml-3 font-semibold underline"
            onClick={() => setError("")}
            type="button"
          >
            Dismiss
          </button>
        </div>
      )}
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
