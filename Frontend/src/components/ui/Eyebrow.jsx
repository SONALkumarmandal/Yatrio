export function Eyebrow({ children, light = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
        light ? "bg-white/15 text-cream" : "bg-teal/10 text-teal"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${light ? "bg-warm" : "bg-teal"}`} />
      {children}
    </span>
  );
}
