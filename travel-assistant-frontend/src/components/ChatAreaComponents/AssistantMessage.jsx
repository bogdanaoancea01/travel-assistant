import { useState, useEffect } from "react";
import { Cloud, Clock, MapPin, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

function PhotoCarousel({ activityName, city }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const query = encodeURIComponent(`${activityName} ${city}`);
    fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=3&client_id=${UNSPLASH_ACCESS_KEY}`)
      .then((res) => res.json())
      .then((data) => setPhotos(data.results?.map((r) => r.urls.regular) ?? []))
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  }, [activityName, city]);

  if (loading) {
    return (
      <div className="flex gap-1 mb-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-1/3 aspect-square rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) return null;

  return (
    <>
      <div className="flex gap-1 mb-3">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="w-1/3 aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setLightbox(i)}
          >
            <img src={photo} alt={`${activityName} ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-3000 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm cursor-pointer"
            >
              ✕ Close
            </button>
            <img
              src={photos[lightbox]}
              alt={activityName}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            {photos.length > 1 && (
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => setLightbox((p) => (p - 1 + photos.length) % photos.length)}
                  className="text-white/70 hover:text-white text-sm cursor-pointer px-3 py-1 rounded-lg hover:bg-white/10"
                >
                  ← Prev
                </button>
                <span className="text-white/50 text-sm self-center">{lightbox + 1} / {photos.length}</span>
                <button
                  onClick={() => setLightbox((p) => (p + 1) % photos.length)}
                  className="text-white/70 hover:text-white text-sm cursor-pointer px-3 py-1 rounded-lg hover:bg-white/10"
                >
                  Next →
                </button>
              </div>
            )}
            <p className="text-center text-white/50 text-xs mt-2">{activityName}</p>
          </div>
        </div>
      )}
    </>
  );
}

function ActivityCard({ activity, index, city }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-2.5">
      <div className="px-3.5 pb-3.5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
              {index + 1}
            </div>
            {/* ← name was accidentally removed, add it back */}
            <span className="text-sm font-medium text-gray-900">
              {activity.name}
            </span>
          </div>
          {activity.isWeatherDependent && (
            <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
              <AlertTriangle className="h-2.5 w-2.5" />
              Weather dependent
            </span>
          )}
        </div>

        {activity.description && (
          <p className="text-xs text-gray-500 leading-relaxed mb-2">{activity.description}</p>
        )}

        <div className="flex flex-wrap gap-3">
          {activity.estimatedDuration && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Clock className="h-3 w-3" /> {activity.estimatedDuration}
            </span>
          )}
          {activity.address && (
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <MapPin className="h-3 w-3" /> {activity.address}
            </span>
          )}
        </div>
      </div>
      <PhotoCarousel activityName={activity.name} city={city} />
    </div>
  );
}

export default function AssistantMessage({ content, aiReply }) {
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
    <div className="space-y-4">
      {/* Summary */}
      <p className="text-sm font-medium leading-relaxed text-gray-900">{trip.summary}</p>

      {/* Weather */}
      {trip.weatherGuidance && (
        <div className="flex gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-2.5">
          <Cloud className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">{trip.weatherGuidance}</p>
        </div>
      )}

      {/* Days */}
      {tripDays.map((day) => (
        <div key={day.dayNumber}>
          {/* Day header — Variant A */}
          <div className="flex items-center gap-3.5 mb-4">
            <span className="bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-full whitespace-nowrap">
              Day {day.dayNumber}
            </span>
            {day.theme && (
              <span className="text-sm text-gray-400 whitespace-nowrap">{day.theme}</span>
            )}
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {(day.activities ?? []).map((activity, i) => (
            <ActivityCard key={i} activity={activity} index={i} city={city} />
          ))}
        </div>
      ))}
    </div>
  );
}