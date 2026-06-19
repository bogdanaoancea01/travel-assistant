import { useState, useEffect } from "react";

const DAY_COLORS = [
  "#0f6e56", "#2563eb", "#dc2626", "#d97706", "#7c3aed",
  "#db2777", "#059669", "#ea580c", "#0891b2", "#65a30d",
  "#9f1239", "#1d4ed8", "#b45309", "#0e7490", "#6d28d9",
];

const getDayColor = (dayNumber) => DAY_COLORS[(dayNumber - 1) % DAY_COLORS.length];

// Build a plain-text location query for the map embed. We prefer placeName —
// an exact, real landmark the model provides — over the experiential card name
// (e.g. "Old Town Walk"), so the embed resolves to one precise point.
const buildQuery = (stop, destination) => {
  if (!stop) return destination || "";
  const parts = [stop.placeName || stop.name, stop.city, stop.country].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  return stop.address || destination || "";
};

export default function TripMapPanel({ destination, dateRange, pins = [], onNewTrip }) {
  // A stop is mappable if we have a name plus some locality text to query.
  const stops = pins.filter((p) => p.name && (p.city || p.country || p.address));
  const days = [...new Set(stops.map((p) => p.day).filter(Boolean))].sort((a, b) => a - b);

  const [selected, setSelected] = useState(0);

  // Reset selection whenever a new trip is loaded.
  useEffect(() => {
    setSelected(0);
  }, [destination]);

  const selectedStop = stops[selected] ?? null;
  const query = buildQuery(selectedStop, destination);
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900">{destination}</p>
            <p className="text-xs text-gray-400">{dateRange}</p>
          </div>
        </div>
        {onNewTrip && (
          <button
            onClick={onNewTrip}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-50"
          >
            + New trip
          </button>
        )}
      </div>

      {/* Day legend */}
      {days.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-gray-100 bg-white shrink-0">
          {days.map((day) => (
            <span key={day} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: getDayColor(day) }} />
              Day {day}
            </span>
          ))}
        </div>
      )}

      {/* Map (text-query embed) */}
      <div className="flex-1 min-h-0">
        <iframe
          key={query}
          title={selectedStop ? selectedStop.name : destination}
          src={mapSrc}
          style={{ height: "100%", width: "100%", border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* Selected stop detail — compact strip below the map (off the map area) */}
      {selectedStop && (
        <div className="border-t border-gray-100 bg-white px-4 py-2 shrink-0">
          <div className="flex items-center gap-x-2 gap-y-0.5 flex-wrap">
            <span className="text-[13px] font-semibold text-gray-900">📌 {selectedStop.name}</span>
            <span className="text-[11px] font-semibold" style={{ color: getDayColor(selectedStop.day ?? 1) }}>
              Day {selectedStop.day ?? 1}
            </span>
            {selectedStop.estimatedDuration && (
              <span className="text-[11px] text-gray-500">⏱ {selectedStop.estimatedDuration}</span>
            )}
            {selectedStop.isWeatherDependent && (
              <span className="text-[11px] text-amber-600">🌤 Weather dependent</span>
            )}
          </div>
          {selectedStop.description && (
            <p className="mt-0.5 text-[12px] text-gray-600 line-clamp-2">{selectedStop.description}</p>
          )}
        </div>
      )}

      {/* Stop list grouped by day — tap a stop to focus the map on it */}
      {stops.length > 0 && (
        <div className="border-t border-gray-100 bg-white p-3 shrink-0 overflow-y-auto max-h-36">
          {days.map((day) => {
            const dayStops = stops.filter((p) => (p.day ?? 1) === day);
            return (
              <div key={day} className="mb-2 last:mb-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                   style={{ color: getDayColor(day) }}>
                  Day {day}
                </p>
                <div className="flex flex-wrap gap-1">
                  {dayStops.map((stop, i) => {
                    const globalIndex = stops.indexOf(stop);
                    const isSelected = globalIndex === selected;
                    return (
                      <button
                        key={`${stop.name}-${i}`}
                        onClick={() => setSelected(globalIndex)}
                        className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                          isSelected
                            ? "border-gray-300 bg-gray-100 text-gray-800"
                            : "border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        <span
                          className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-white text-[8px] font-bold shrink-0"
                          style={{ background: getDayColor(day) }}
                        >
                          {i + 1}
                        </span>
                        {stop.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {stops.length === 0 && pins.length > 0 && (
        <div className="p-4 text-xs text-gray-400 text-center shrink-0">
          Location details unavailable for these stops.
        </div>
      )}
    </div>
  );
}
