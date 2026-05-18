import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DAY_COLORS = [
  "#0f6e56", "#2563eb", "#dc2626", "#d97706", "#7c3aed",
  "#db2777", "#059669", "#ea580c", "#0891b2", "#65a30d",
  "#9f1239", "#1d4ed8", "#b45309", "#0e7490", "#6d28d9",
];

const getDayColor = (dayNumber) => DAY_COLORS[(dayNumber - 1) % DAY_COLORS.length];

const createNumberedIcon = (number, color) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        background:${color};color:white;width:28px;height:28px;
        border-radius:50% 50% 50% 0;transform:rotate(-45deg);
        display:flex;align-items:center;justify-content:center;
        border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);
      ">
        <span style="transform:rotate(45deg);font-size:11px;font-weight:600">${number}</span>
      </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -32],
  });

function MapBounds({ pins }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0) return;
    if (pins.length === 1) {
      map.flyTo([pins[0].lat, pins[0].lng], 14, { duration: 1.2 });
      return;
    }
    const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng]));
    map.flyToBounds(bounds, { padding: [48, 48], duration: 1.2 });
  }, [pins, map]);
  return null;
}

export default function TripMapPanel({ destination, dateRange, pins = [], onNewTrip }) {
  const validPins = pins.filter((p) => p.lat && p.lng && p.lat !== 0 && p.lng !== 0);
  const days = [...new Set(validPins.map((p) => p.day).filter(Boolean))].sort((a, b) => a - b);

  const centerLat = validPins.length > 0
    ? validPins.reduce((sum, p) => sum + p.lat, 0) / validPins.length
    : 41.9028;
  const centerLng = validPins.length > 0
    ? validPins.reduce((sum, p) => sum + p.lng, 0) / validPins.length
    : 12.4964;

  const dayCounters = {};

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

      {/* Map */}
      <div className="flex-1 min-h-0" onWheel={(e) => e.stopPropagation()}>
        <MapContainer
          key={`${centerLat}-${centerLng}`}
          center={[centerLat, centerLng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {validPins.map((pin) => {
            const day = pin.day ?? 1;
            dayCounters[day] = (dayCounters[day] ?? 0) + 1;
            const number = dayCounters[day];
            const color = getDayColor(day);

            return (
              <Marker
                key={`${pin.name}-${day}-${number}`}
                position={[pin.lat, pin.lng]}
                icon={createNumberedIcon(number, color)}
              >
                <Popup maxWidth={260} minWidth={200}>
                  <div style={{ fontFamily: "inherit", fontSize: "12px", lineHeight: "1.5" }}>

                    {/* Title */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "16px" }}>📌</span>
                      <p style={{ fontWeight: 700, fontSize: "13px", margin: 0, color: "#111827" }}>{pin.name}</p>
                    </div>

                    {/* Day badge */}
                    <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: "11px", color }}>
                      Day {day}
                    </p>

                    {/* Duration + weather */}
                    {(pin.estimatedDuration || pin.isWeatherDependent) && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                        {pin.estimatedDuration && (
                          <span style={{ color: "#6b7280", fontSize: "11px" }}>⏱ {pin.estimatedDuration}</span>
                        )}
                        {pin.isWeatherDependent && (
                          <span style={{ color: "#d97706", fontSize: "11px" }}>🌤 Weather dependent</span>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    {pin.description && (
                      <p style={{ margin: "0 0 8px", color: "#374151", fontSize: "12px" }}>
                        {pin.description}
                      </p>
                    )}

                    {/* Address */}
                    {pin.address && (
                      <p style={{ margin: "0 0 8px", color: "#9ca3af", fontSize: "11px" }}>
                        📍 {pin.address}
                      </p>
                    )}

                    {/* Tips */}
                    {pin.tips?.length > 0 && (
                      <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "6px" }}>
                        {pin.tips.map((tip, i) => (
                          <p key={i} style={{ margin: "0 0 4px", color: "#6b7280", fontSize: "11px" }}>
                            💡 {tip}
                          </p>
                        ))}
                      </div>
                    )}

                  </div>
                </Popup>
              </Marker>
            );
          })}

          <MapBounds pins={validPins} />
        </MapContainer>
      </div>

      {/* Pin list grouped by day */}
      {validPins.length > 0 && (
        <div className="border-t border-gray-100 bg-white p-3 shrink-0 overflow-y-auto max-h-36">
          {days.map((day) => {
            const dayPins = validPins.filter((p) => (p.day ?? 1) === day);
            return (
              <div key={day} className="mb-2 last:mb-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                   style={{ color: getDayColor(day) }}>
                  Day {day}
                </p>
                <div className="flex flex-wrap gap-1">
                  {dayPins.map((pin, i) => (
                    <span
                      key={`${pin.name}-${i}`}
                      className="flex items-center gap-1 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-0.5 text-xs text-gray-500"
                    >
                      <span
                        className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-white text-[8px] font-bold shrink-0"
                        style={{ background: getDayColor(day) }}
                      >
                        {i + 1}
                      </span>
                      {pin.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {validPins.length === 0 && pins.length > 0 && (
        <div className="p-4 text-xs text-gray-400 text-center shrink-0">
          Coordinates unavailable — geocoding may still be in progress.
        </div>
      )}
    </div>
  );
}
