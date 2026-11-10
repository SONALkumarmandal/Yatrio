import { Link } from "react-router-dom";

export function YatreoMark({ size = 38, onDark = false, className = "" }) {
  const forkColor = onDark ? "#FAF6F0" : "#0F5C5E";
  const runwayColor = onDark ? "#0F5C5E" : "#FAF6F0";
  const planeColor = "#F4A93B";

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 48 48"
      width={size}
    >
      {/* The Fork: Bold, rounded Y */}
      {/* Left Arm */}
      <path
        d="M12 9 C14 16, 18 22, 24 25"
        stroke={forkColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5.5"
      />
      {/* Right Arm */}
      <path
        d="M36 9 C34 16, 30 22, 24 25"
        stroke={forkColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5.5"
      />
      {/* Stem / Runway */}
      <path
        d="M24 24.5 V40"
        stroke={forkColor}
        strokeLinecap="round"
        strokeWidth="5.5"
      />

      {/* Runway centerlines (cutout dashes in the stem) */}
      <line
        stroke={runwayColor}
        strokeLinecap="round"
        strokeWidth="1.8"
        x1="24"
        x2="24"
        y1="28"
        y2="30.5"
      />
      <line
        stroke={runwayColor}
        strokeLinecap="round"
        strokeWidth="1.8"
        x1="24"
        x2="24"
        y1="33"
        y2="35.5"
      />
      <line
        stroke={runwayColor}
        strokeLinecap="round"
        strokeWidth="1.8"
        x1="24"
        x2="24"
        y1="38"
        y2="39.5"
      />

      {/* Ascending Golden Airplane in the fork crotch */}
      <g transform="translate(24, 15)">
        {/* Airplane Silhouette */}
        <path
          d="M0 -9.5 
             C0.7 -9.5, 1.2 -8.5, 1.2 -6.5 
             L1.2 -2.5 
             L8.8 1.8 
             L8.8 3.5 
             L1.2 1.5 
             L1.2 5.5 
             L3.8 7.5 
             L3.8 9 
             L0 8 
             L-3.8 9 
             L-3.8 7.5 
             L-1.2 5.5 
             L-1.2 1.5 
             L-8.8 3.5 
             L-8.8 1.8 
             L-1.2 -2.5 
             L-1.2 -6.5 
             C-1.2 -8.5, -0.7 -9.5, 0 -9.5 Z"
          fill={planeColor}
        />
      </g>
    </svg>
  );
}

export function Logo({ onDark = false, size = "default", withTagline = true, className = "" }) {
  const textColor = onDark ? "text-cream" : "text-teal";
  const taglineColor = onDark ? "text-warm/90" : "text-muted";
  const markSize = size === "large" ? 44 : size === "small" ? 28 : 34;

  return (
    <Link
      aria-label="Yatreo home — Holidays, handled"
      className={`group inline-flex items-center gap-2 transition-transform duration-200 hover:scale-[1.01] ${className}`}
      to="/"
    >
      <YatreoMark onDark={onDark} size={markSize} />
      <div className="flex flex-col">
        <span
          className={`font-wordmark text-[1.48rem] font-extrabold leading-none tracking-[-0.05em] ${textColor}`}
        >
          yatreo
        </span>
        {withTagline && (
          <span
            className={`font-body text-[0.54rem] font-semibold uppercase tracking-[0.16em] leading-tight ${taglineColor}`}
          >
            holidays, handled.
          </span>
        )}
      </div>
    </Link>
  );
}
