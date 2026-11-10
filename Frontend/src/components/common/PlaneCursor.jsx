import { useEffect, useRef, useState } from "react";

/**
 * Calibrated Cute Aeroplane Cursor
 * 
 * - Restores the fun 360° banking airplane with spinning propeller & chubby fuselage
 * - Calibrated Hotspot: transformOrigin & translation anchored strictly to (50% 12.5%),
 *   which is the EXACT nose tip (22px, 5.5px) in the SVG.
 * - Zero Lag: Coordinates match clientX/clientY instantly so clicks register at the nose tip.
 * - Dynamic 360° Flight Banking: Natural banking physics as you steer across the screen.
 * - Contrails: Puffy clouds spawn from the tail exhaust.
 */
export function PlaneCursor() {
  const cursorRef = useRef(null);
  const planeRef = useRef(null);
  const canvasRef = useRef(null);

  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const prevPos = useRef({ x: -100, y: -100 });
  const angle = useRef(45); // default flight angle
  const targetAngle = useRef(45);
  const isHovering = useRef(false);
  const isMouseDown = useRef(false);
  const isVisible = useRef(false);
  const particles = useRef([]);
  const lastParticleTime = useRef(0);

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable on desktop with fine pointer and no reduced motion preference
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReducedMotion) {
      return;
    }

    setEnabled(true);
    document.documentElement.classList.add("plane-cursor-enabled");

    const getZoomFactor = () => {
      return parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1;
    };

    const onMouseMove = (e) => {
      // Divide by zoom factor to compensate for CSS zoom scaling (e.g. 1.15)
      // This completely eliminates coordinate drift between physical mouse and cursor
      const zoom = getZoomFactor();
      target.current.x = e.clientX / zoom;
      target.current.y = e.clientY / zoom;
      isVisible.current = true;

      // Check if hovering clickable interactive targets
      const targetEl = e.target;
      const isClickable = Boolean(
        targetEl.closest("a") ||
        targetEl.closest("button") ||
        targetEl.closest('input[type="button"]') ||
        targetEl.closest('input[type="submit"]') ||
        targetEl.closest('[role="button"]') ||
        targetEl.closest(".clickable") ||
        targetEl.closest(".filter-chip") ||
        targetEl.closest(".destination-card")
      );
      isHovering.current = isClickable;
    };

    const onMouseDown = () => {
      isMouseDown.current = true;
    };

    const onMouseUp = () => {
      isMouseDown.current = false;
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      target.current.x = -100;
      target.current.y = -100;
    };

    const onMouseEnter = () => {
      isVisible.current = true;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter, { passive: true });

    // Contrails Canvas setup (zoom-calibrated)
    const canvas = canvasRef.current;
    let ctx = null;
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const zoom = getZoomFactor();
        canvasRef.current.width = window.innerWidth / zoom;
        canvasRef.current.height = window.innerHeight / zoom;
      }
    };

    if (canvas) {
      ctx = canvas.getContext("2d");
      updateCanvasSize();
    }
    window.addEventListener("resize", updateCanvasSize, { passive: true });

    // Animation Loop
    let animId;
    const lerp = (a, b, n) => a + (b - a) * n;

    const render = (time) => {
      // Direct instant position sync — ZERO lag so clicks land exactly on the nose
      pos.current.x = target.current.x;
      pos.current.y = target.current.y;

      // Compute movement delta for full 360° banking angle
      const dx = target.current.x - prevPos.current.x;
      const dy = target.current.y - prevPos.current.y;
      const speed = Math.hypot(dx, dy);

      if (speed > 1.2) {
        // Calculate flight heading in degrees (0 = right, 90 = down)
        // Sprite points UP (0 deg), so add 90 deg to align with atan2
        const rad = Math.atan2(dy, dx);
        let deg = (rad * 180) / Math.PI + 90;

        // Normalize delta angle for shortest rotation path
        let diff = (deg - targetAngle.current + 180) % 360 - 180;
        targetAngle.current += diff;

        // Spawn cute contrail clouds from the plane's tail
        if (time - lastParticleTime.current > 40 && speed > 2.5) {
          lastParticleTime.current = time;
          // Tail is directly behind the current flight angle (distance ~28px from nose)
          const angleRad = ((angle.current - 90) * Math.PI) / 180;
          particles.current.push({
            x: pos.current.x - Math.cos(angleRad) * 28,
            y: pos.current.y - Math.sin(angleRad) * 28,
            size: Math.random() * 3 + 2.5,
            maxSize: Math.random() * 7 + 6,
            alpha: 0.65,
            decay: Math.random() * 0.02 + 0.022,
            vx: -Math.cos(angleRad) * 0.3 + (Math.random() - 0.5) * 0.4,
            vy: -Math.sin(angleRad) * 0.3 + (Math.random() - 0.5) * 0.4,
            hue: Math.random() > 0.45 ? "#FAF6F0" : "#F4A93B",
          });
        }
      }

      // Smooth aerodynamic banking interpolation
      angle.current = lerp(angle.current, targetAngle.current, 0.22);
      prevPos.current.x = target.current.x;
      prevPos.current.y = target.current.y;

      // Update Plane DOM Transform
      // - translate3d places container at cursor position
      // - planeRef uses translate(-50%, -12.5%) so that the NOSE (22px, 5.5px in 44x44 SVG) is AT (0,0)
      // - transformOrigin is set to "50% 12.5%" (the nose), so rotations NEVER move the nose away from the click point!
      if (cursorRef.current && planeRef.current) {
        if (!isVisible.current || pos.current.x < 0) {
          cursorRef.current.style.opacity = "0";
        } else {
          cursorRef.current.style.opacity = "1";
          const hoverScale = isHovering.current ? 1.2 : 1.0;
          const clickScale = isMouseDown.current ? 0.88 : 1.0;
          const scale = hoverScale * clickScale;

          cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
          planeRef.current.style.transform = `translate(-50%, -12.5%) rotate(${angle.current}deg) scale(${scale})`;
          planeRef.current.style.transformOrigin = "50% 12.5%";
        }
      }

      // Render Contrail Clouds on Canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.current.length - 1; i >= 0; i--) {
          const p = particles.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.size = lerp(p.size, p.maxSize, 0.07);
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particles.current.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle =
            p.hue === "#FAF6F0"
              ? `rgba(250, 246, 240, ${p.alpha * 0.65})`
              : `rgba(244, 169, 59, ${p.alpha * 0.4})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + 1, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.3})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("resize", updateCanvasSize);
      document.documentElement.classList.remove("plane-cursor-enabled");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Contrail Clouds Canvas Layer */}
      <canvas
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9998]"
        ref={canvasRef}
      />

      {/* Aeroplane Cursor Element */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[99999] will-change-transform"
        ref={cursorRef}
        style={{
          transform: "translate3d(-100px, -100px, 0)",
        }}
      >
        <div
          className="relative will-change-transform"
          ref={planeRef}
          style={{ width: 38, height: 38 }}
        >
          {/*
            The Beloved Fun Mascot Aeroplane SVG
            viewBox="0 0 44 44"
            - Nose Tip / Propeller Hotspot: (22, 5.5) -> precisely anchored at 50% 12.5%
            - Chubby Sunrise Gold Fuselage, Deep Teal Wings, Spinning Propeller, Blush Cheeks
          */}
          <svg
            className="drop-shadow-[0_4px_8px_rgba(17,42,45,0.22)]"
            fill="none"
            height="38"
            viewBox="0 0 44 44"
            width="38"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Spinning propeller shadow disc */}
            <ellipse
              cx="22"
              cy="5.5"
              fill="rgba(255,255,255,0.4)"
              rx="9"
              ry="2"
              stroke="#0F5C5E"
              strokeDasharray="2 2"
              strokeWidth="0.8"
            >
              <animateTransform
                attributeName="transform"
                dur="0.18s"
                from="0 22 5.5"
                repeatCount="indefinite"
                to="360 22 5.5"
                type="rotate"
              />
            </ellipse>

            {/* Cute Wings (Chubby Deep Teal) */}
            <path
              d="M7 23 C7 20, 15 20, 22 19 C29 20, 37 20, 37 23 C37 25.5, 29 25, 22 25 C15 25, 7 25.5, 7 23 Z"
              fill="#0F5C5E"
              stroke="#0A4446"
              strokeWidth="1.2"
            />
            {/* Wing Tip Accents (Gold) */}
            <circle cx="8" cy="23" fill="#F4A93B" r="2.2" />
            <circle cx="36" cy="23" fill="#F4A93B" r="2.2" />

            {/* Horizontal Stabilizer (Tail Wings) */}
            <path
              d="M13 36 C13 34, 18 34.5, 22 34 C26 34.5, 31 34, 31 36 C31 37.8, 26 37.5, 22 37.5 C18 37.5, 13 37.8, 13 36 Z"
              fill="#0F5C5E"
            />

            {/* Chubby Fuselage (Sunrise Gold) */}
            <path
              d="M22 6.5 
                 C26 6.5, 28.5 12, 28.5 21 
                 C28.5 29, 26 38, 22 39 
                 C18 38, 15.5 29, 15.5 21 
                 C15.5 12, 18 6.5, 22 6.5 Z"
              fill="#F4A93B"
              stroke="#C67D1E"
              strokeLinejoin="round"
              strokeWidth="1.2"
            />

            {/* Underbelly Accent Strip (Sunrise Cream) */}
            <path
              d="M22 8 C23.8 8, 25 12, 25 18 C25 24, 23.8 28, 22 28 C20.2 28, 19 24, 19 18 C19 12, 20.2 8, 22 8 Z"
              fill="#FAF6F0"
              opacity="0.85"
            />

            {/* Cute Glass Cockpit (Lagoon/Teal with glossy shine) */}
            <path
              d="M20 12 C20 10.5, 24 10.5, 24 12 C24.5 14, 24 15.5, 22 15.5 C20 15.5, 19.5 14, 20 12 Z"
              fill="#0F5C5E"
            />
            {/* Cockpit Glint */}
            <ellipse cx="21.2" cy="12" fill="#FFFFFF" rx="1.2" ry="0.8" />

            {/* Cute Cheek Blushes (Rosy Pink) */}
            <circle cx="17.2" cy="18" fill="#F43F5E" opacity="0.45" r="1.3" />
            <circle cx="26.8" cy="18" fill="#F43F5E" opacity="0.45" r="1.3" />

            {/* Jet Nose Propeller Spinner Cap — The Exact Click Hotspot */}
            <ellipse cx="22" cy="6" fill="#0F5C5E" rx="2" ry="1.4" />
            <circle cx="22" cy="5.5" fill="#FAF6F0" r="1.2" stroke="#0F5C5E" strokeWidth="0.6" />

            {/* Tail Fin Vertical Stabilizer (Deep Ink) */}
            <path
              d="M21 32 L23 32 L22.5 38.5 L21.5 38.5 Z"
              fill="#112A2D"
            />
          </svg>

          {/* Tiny Golden Sparkle on Hover */}
          <span
            className="pointer-events-none absolute -right-0.5 -top-0.5 block h-2 w-2 rounded-full bg-warm transition-opacity duration-150"
            style={{
              opacity: isHovering.current ? 1 : 0,
              boxShadow: "0 0 6px #F4A93B",
            }}
          />
        </div>
      </div>
    </>
  );
}
