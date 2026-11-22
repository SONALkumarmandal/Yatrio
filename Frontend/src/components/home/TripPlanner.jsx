import { useState } from "react";
import { CalendarDays, MapPin, MessageCircle, Users } from "lucide-react";
import { whatsappUrl } from "../../data/destinations";

export function TripPlanner({ destinations = [] }) {
  const [where, setWhere] = useState("");
  const [when, setWhen] = useState("");
  const [who, setWho] = useState("2 travellers");

  const message = `Hi Yatreo! Chalo, let's plan it.\n\nWhere: ${where || "Still deciding"}\nWhen: ${when || "I'm flexible"}\nWho: ${who}\n\nCould you help me plan a thoughtful trip?`;

  return (
    <form
      className="trip-planner"
      onSubmit={(event) => {
        event.preventDefault();
        window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
      }}
    >
      <div className="trip-planner-fields">
        <label className="planner-field border-r border-sand/60 pr-2 md:border-b-0">
          <span>
            <MapPin size={15} /> Where
          </span>
          <select onChange={(event) => setWhere(event.target.value)} value={where}>
            <option value="">Surprise me</option>
            {destinations.map((destination) => (
              <option key={destination.slug} value={destination.name}>
                {destination.name}
              </option>
            ))}
          </select>
        </label>

        <label className="planner-field md:border-r md:border-sand/60 md:pr-2 md:border-b-0">
          <span>
            <CalendarDays size={15} /> When
          </span>
          <select onChange={(event) => setWhen(event.target.value)} value={when}>
            <option value="">I’m flexible</option>
            <option>In the next month</option>
            <option>In 1–3 months</option>
            <option>In 3–6 months</option>
            <option>I have dates in mind</option>
          </select>
        </label>

        <label className="planner-field col-span-2 md:col-span-1 md:border-b-0">
          <span>
            <Users size={15} /> Who
          </span>
          <select onChange={(event) => setWho(event.target.value)} value={who}>
            <option>Just me</option>
            <option>2 travellers</option>
            <option>Family</option>
            <option>Friends</option>
          </select>
        </label>

        <button className="button-gold planner-submit" type="submit">
          <MessageCircle size={16} /> Plan my trip
        </button>
      </div>

      <div aria-live="polite" className="planner-preview flex items-center justify-between text-[11px] text-muted pt-2.5 mt-2.5 border-t border-sand/40">
        <span className="flex items-center gap-1.5 font-medium text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          1-on-1 human planner chat on WhatsApp
        </span>
        <span className="text-[10px] text-muted hidden sm:inline">Zero bots · Free customized quote</span>
      </div>
    </form>
  );
}
