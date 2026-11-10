import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Eyebrow } from "./Eyebrow";

export function SectionHeading({ eyebrow, title, description, linkTo }) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-4 md:mb-14 md:flex-row md:items-end">
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-base text-muted md:text-lg">{description}</p>
        )}
      </div>
      {linkTo && (
        <Link
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition-all hover:gap-2.5 hover:text-teal-hover"
          to={linkTo}
        >
          View all
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
