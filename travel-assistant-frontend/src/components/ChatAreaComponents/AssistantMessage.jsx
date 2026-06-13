import { useState, useEffect } from "react";
import { Clock, MapPin, AlertTriangle, Sparkles, Droplets, Sun, Map, Calendar } from "lucide-react";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const REFINEMENTS = [
  { label: "More relaxed", prompt: "Relax the pace — fewer activities per day with more downtime." },
  { label: "More outdoors", prompt: "Add more outdoor and nature activities to the plan." },
  { label: "More food & drink", prompt: "Add more notable food and drink experiences to each day." },
  { label: "Hidden gems", prompt: "Swap some mainstream spots for lesser-known local gems." },
];

/* Lightbox */
function Lightbox({ photos, index, onClose }) {
  const [current, setCurrent] = useState(index);
  return (
    <div
      className="fixed inset-0 z-3000 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm cursor-pointer">
          ✕ Close
        </button>
        <img src={photos[current]} className="w-full max-h-[80vh] object-contain rounded-xl" />
        {photos.length > 1 && (
          <div className="flex justify-between mt-3">
            <button onClick={() => setCurrent((p) => (p - 1 + photos.length) % photos.length)} className="text-white/70 hover:text-white text-sm cursor-pointer px-3 py-1 rounded-lg hover:bg-white/10">← Prev</button>
            <span className="text-white/50 text-sm self-center">{current + 1} / {photos.length}</span>
            <button onClick={() => setCurrent((p) => (p + 1) % photos.length)} className="text-white/70 hover:text-white text-sm cursor-pointer px-3 py-1 rounded-lg hover:bg-white/10">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* Activity card */
function ActivityCard({ activity, index, city }) {
  const [heroPhoto, setHeroPhoto] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [stripPhotos, setStripPhotos] = useState([]);
  const [stripLoading, setStripLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  // Hero image
  useEffect(() => {
    const q = encodeURIComponent(`${activity.name} ${city}`);
    fetch(`https://api.unsplash.com/search/photos?query=${q}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`)
      .then(r => r.json())
      .then(d => setHeroPhoto(d.results?.[0]?.urls?.regular ?? null))
      .catch(() => {})
      .finally(() => setHeroLoading(false));
  }, [activity.name, city]);

  // Strip photos
  useEffect(() => {
    const q = encodeURIComponent(`${activity.name} ${city}`);
    fetch(`https://api.unsplash.com/search/photos?query=${q}&per_page=4&client_id=${UNSPLASH_ACCESS_KEY}`)
      .then(r => r.json())
      .then(d => setStripPhotos((d.results ?? []).slice(1).map(r => r.urls.regular)))
      .catch(() => {})
      .finally(() => setStripLoading(false));
  }, [activity.name, city]);

  const allPhotos = heroPhoto ? [heroPhoto, ...stripPhotos] : stripPhotos;

  return (
    <div className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100">

      {/* ── Top section: hero image left + content right ── */}
      <div className="flex" style={{ height: "240px" }}>

        {/* LEFT — full-height hero with number badge */}
        <div className="relative shrink-0" style={{ width: "38%" }}>
          {heroLoading ? (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          ) : heroPhoto ? (
            <img
              src={heroPhoto}
              alt={activity.name}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              onClick={() => setLightbox(0)}
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <Map className="h-8 w-8 text-gray-300" />
            </div>
          )}
          {/* Number badge */}
          <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold shadow-md z-10">
            {index + 1}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 min-w-0 px-4 pt-4 pb-4 flex flex-col">

          {/* Name */}
          <h3 className="text-[15px] font-semibold text-gray-900 leading-snug mb-2.5">{activity.name}</h3>

          {/* Weather badge */}
          {activity.isWeatherDependent && (
            <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full mb-2.5 self-start">
              <AlertTriangle className="h-3 w-3" />
              Weather dependent
            </span>
          )}

          {/* Description */}
          {activity.description && (
            <p className="text-[13px] text-gray-500 leading-relaxed flex-1 overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
              {activity.description}
            </p>
          )}

          {/* Duration + address — pinned to bottom */}
          <div className="flex items-start gap-1 text-xs text-gray-400 mt-auto pt-2 flex-wrap">
            {activity.estimatedDuration && (
              <span className="flex items-center gap-1 shrink-0">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                {activity.estimatedDuration}
              </span>
            )}
            {activity.estimatedDuration && activity.address && (
              <span className="mx-2 text-gray-200 shrink-0">|</span>
            )}
            {activity.address && (
              <span className="flex items-start gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-px" />
                <span className="leading-snug">{activity.address}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {stripLoading ? (
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-24 bg-gray-100 animate-pulse" />
          <div className="flex-1 h-24 bg-gray-100 animate-pulse" />
        </div>
      ) : stripPhotos.length > 0 ? (
        <div className="flex gap-2 pt-2">
          {stripPhotos.slice(0, 2).map((photo, i) => (
            <div
              key={i}
              className="flex-1 h-24 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setLightbox(i + 1)}
            >
              <img src={photo} alt={`${activity.name} ${i + 2}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}

      {lightbox !== null && allPhotos.length > 0 && (
        <Lightbox photos={allPhotos} index={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}

/* Compact weather bar */
function WeatherBar({ trip }) {
  const hasWeather = trip.weatherHighC > 0 || trip.weatherLowC > 0 || trip.weatherRainChancePct > 0;
  if (!hasWeather) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-xs font-semibold text-gray-700">Forecast</span>
        {trip.weatherDateRange && (
          <span className="text-[11px] text-gray-400">{trip.weatherDateRange}</span>
        )}
      </div>
      <div className="flex items-center gap-5 flex-wrap">
        <div>
          <p className="text-[10px] text-gray-400 mb-0.5">Highs</p>
          <p className="text-xl font-bold text-orange-500 leading-none">{trip.weatherHighC}°C</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 mb-0.5">Lows</p>
          <p className="text-xl font-bold text-blue-500 leading-none">{trip.weatherLowC}°C</p>
        </div>
        <div className="h-8 w-px bg-gray-100" />
        {trip.weatherRainChancePct > 0 && (
          <div className="flex items-start gap-1.5">
            <Droplets className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800 leading-none">{trip.weatherRainChancePct}%</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{trip.weatherCondition || "Rain chance"}</p>
            </div>
          </div>
        )}
        {trip.weatherUvIndex > 0 && (
          <div className="flex items-start gap-1.5">
            <Sun className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800 leading-none">~{trip.weatherUvIndex}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">UV index</p>
            </div>
          </div>
        )}
      </div>
      {trip.weatherGuidance && (
        <p className="text-[11px] text-blue-600 leading-relaxed mt-2.5 pt-2.5 border-t border-blue-50">
          {trip.weatherGuidance}
        </p>
      )}
    </div>
  );
}

/* Trip overview card */
function TripOverview({ trip }) {
  const [heroPhoto, setHeroPhoto] = useState(null);

  useEffect(() => {
    const dest = trip.destination?.city ?? "";
    if (!dest) return;
    const q = encodeURIComponent(`${dest} city`);
    fetch(`https://api.unsplash.com/search/photos?query=${q}&per_page=1&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`)
      .then(r => r.json())
      .then(d => setHeroPhoto(d.results?.[0]?.urls?.regular ?? null))
      .catch(() => {});
  }, [trip.destination?.city]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex gap-4 p-4">
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <span className="text-[10px] font-semibold text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
              Trip overview
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-900 leading-snug mb-2">{trip.summary}</p>
          {trip.tripTags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {trip.tripTags.map((tag, i) => (
                <span key={i} className="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {heroPhoto && (
          <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0">
            <img src={heroPhoto} alt={trip.destination?.city} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AssistantMessage({ content, aiReply, onRefine, isLast }) {
  if (!aiReply?.isPlanComplete) {
    return (
      <p className="text-sm leading-relaxed text-gray-800">
        {typeof content === "string" ? content : JSON.stringify(content)}
      </p>
    );
  }

  const trip = aiReply.tripDetails;
  const tripDays = trip.itinerary ?? [];
  const city = trip.destination?.city ?? "";

  return (
    <div className="space-y-3">
      <TripOverview trip={trip} />
      <WeatherBar trip={trip} />

      {tripDays.map((day, dayIndex) => (
        <div key={day.dayNumber} className={dayIndex > 0 ? "pt-4" : ""}>

          {/* Day header */}
          <div className="mb-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-4 py-1.5 rounded-full shrink-0">
                <Calendar className="h-3.5 w-3.5" />
                Day {day.dayNumber}
              </div>
              {day.theme && (
                <span className="text-sm font-semibold text-gray-900">{day.theme}</span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2">
              {day.theme && (
                <span className="text-xs text-gray-400">
                  {(day.activities ?? []).length} activities
                </span>
              )}
              <div className="flex-1 h-px bg-gray-100" />
            </div>
          </div>

          {/* Activities */}
          {(day.activities ?? []).map((activity, i) => (
            <ActivityCard key={i} activity={activity} index={i} city={city} />
          ))}

          {/* Local tip */}
          {day.localTip && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl px-4 py-3 mt-1 mb-3">
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <span className="text-white text-sm">💡</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-800">Local tip</span>
                <br />
                {day.localTip}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Packing list */}
      {trip.packingList?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold text-gray-700 mb-2">What to pack</p>
          <div className="space-y-1.5">
            {trip.packingList.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 text-[9px] font-bold">✓</span>
                <span className="text-xs text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refine buttons */}
      {isLast && onRefine && (
        <div className="pt-1">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">
            <Sparkles className="h-3 w-3" /> Refine this plan
          </p>
          <div className="flex flex-wrap gap-2">
            {REFINEMENTS.map((r) => (
              <button
                key={r.label}
                onClick={() => onRefine(r.prompt)}
                className="text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors cursor-pointer"
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
