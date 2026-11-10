import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <Compass className="text-teal/40" size={40} />
      <h1 className="mt-4 font-display text-3xl font-semibold text-teal">That way’s still a mystery.</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
        We couldn’t find the page you were looking for. Let’s get you back on the right path.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link className="button-teal px-5 py-2.5 text-xs" to="/">
          Go to Home
        </Link>
        <Link className="button-gold px-5 py-2.5 text-xs" to="/destinations">
          Explore Destinations
        </Link>
      </div>
    </div>
  );
}
