import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

export function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Respect user's preference for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    // Recalculate Lenis scroll limit immediately whenever app content resizes
    const rootEl = document.getElementById("root") || document.body;
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => lenis.resize()) : null;
    ro?.observe(rootEl);

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      ro?.disconnect();
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll to top on route change and keep Lenis bounds synced with new page height
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!hash) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
    }
    const frameId = requestAnimationFrame(() => {
      lenisRef.current?.resize();
    });
    return () => cancelAnimationFrame(frameId);
  }, [pathname, hash]);

  return <>{children}</>;
}
