import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [savedSlugs, setSavedSlugs] = useState(() => {
    try {
      const saved = localStorage.getItem("yatreo_wishlist");
      return saved ? JSON.parse(saved) : ["kerala", "ladakh"];
    } catch {
      return ["kerala", "ladakh"];
    }
  });

  useEffect(() => {
    localStorage.setItem("yatreo_wishlist", JSON.stringify(savedSlugs));
  }, [savedSlugs]);

  function toggleWishlist(slug) {
    setSavedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function isSaved(slug) {
    return savedSlugs.includes(slug);
  }

  return (
    <WishlistContext.Provider
      value={{
        savedSlugs,
        toggleWishlist,
        isSaved,
        count: savedSlugs.length,
      }}
    >
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
