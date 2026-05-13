import { useState, useEffect } from "react";
import SectionHeader from "../RecommendationPanel/SectionHeader";
import { GlobeSVG } from "../RecommendationPanel/GlobeSVG";
import TripMapPanel from "../MapPanel/TripMapPanel";

const SURPRISE_PROMPTS = [
  "Plan a 6-day trip to a hidden gem in Southeast Asia. Choose the destination for me.",
  "Plan a 5-day trip to an underrated city in Eastern Europe. Choose the destination for me.",
  "Plan a 7-day trip to a unique cultural destination in South America. Choose the destination for me.",
  "Plan a 5-day trip to a lesser-known Mediterranean destination. Choose the destination for me.",
];

const SURPRISE_CARD = {
  city: "Surprise me",
  country: "Anywhere",
  durationDays: null,
  emoji: "✨",
  prompt: SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)],
};

const HOW_IT_WORKS = [
  { icon: "💬", text: "Tell me your destination and number of days. Budget, pace, and interests are optional." },
  { icon: "📍", text: "I'll generate a day-by-day itinerary grouped by neighborhood, with a live map of every stop." },
  { icon: "🌤", text: "Weather is fetched automatically — either a live forecast or historical averages depending on your travel dates." },
];

const FALLBACK_EMOJIS = ["🗺️", "✈️", "🌍", "🏛️", "🌅", "🗼", "🏖️", "🌄", "🧳", "🌏"];

const getEmoji = (dest) => {
  if (dest.emoji) return dest.emoji;
  // deterministic based on city name so it doesn't change on re-render
  const index = dest.city.charCodeAt(0) % FALLBACK_EMOJIS.length;
  return FALLBACK_EMOJIS[index];
};

function DestinationSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2 mt-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 h-20 animate-pulse" />
      ))}
    </div>
  );
}

export default function RecommendationsPanel({ activeTrip, onPrompt, onNewTrip }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch("https://localhost:7063/api/PopularDestinations/generatedestinations");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setDestinations(data);
      } catch (err) {
        console.error("Failed to load destinations:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, []);

  // AI destinations + always-present Surprise Me as 6th card
  const allCards = [...destinations, SURPRISE_CARD];

  if (activeTrip) {
    return (
      <div className="bg-white px-5 py-5 overflow-y-auto h-full">
        <TripMapPanel
          destination={activeTrip.destination}
          dateRange={activeTrip.dateRange}
          pins={activeTrip.pins}
          onNewTrip={onNewTrip}
        />
      </div>
    );
  }

  return (
    <div className="bg-white px-5 py-5 h-full flex flex-col gap-4 overflow-hidden">

      {/* Globe hero */}
      <div className="flex flex-col items-center gap-2 rounded-xl px-4 py-5">
        <GlobeSVG />
        <p className="text-base font-medium text-gray-900">Where to next?</p>
        <p className="max-w-xs text-center text-xs leading-relaxed text-gray-500">
          Tell me a destination and how many days you have. I'll handle the rest.
        </p>
      </div>

      {/* Destination grid */}
      <div>
        <SectionHeader title="Popular right now" />
        {loading ? (
          <DestinationSkeleton />
        ) : error ? (
          <p className="mt-2 text-xs text-gray-400">Could not load destinations. Try refreshing.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {allCards.map((dest, i) => (
              <button
                key={i}
                onClick={() => onPrompt(dest.prompt)}
                className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-white px-3 py-2.5 text-left transition-colors hover:bg-gray-50 active:scale-95 cursor-pointer"
              >
                {/* Change this line: */}
                <span className="text-base" aria-hidden="true">{getEmoji(dest)}</span>
                <span className="text-xs font-medium text-gray-900">{dest.city}</span>
                <span className="text-[11px] text-gray-400">
                  {dest.country}{dest.durationDays ? ` · ${dest.durationDays} days` : ""}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="flex flex-col gap-2">
        <SectionHeader title="How it works" />
        {HOW_IT_WORKS.map((item, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2.5">
            <span className="mt-0.5 text-sm" aria-hidden="true">{item.icon}</span>
            <p className="text-xs leading-relaxed text-gray-500">{item.text}</p>
          </div>
        ))}
      </div>

    </div>
  );
}