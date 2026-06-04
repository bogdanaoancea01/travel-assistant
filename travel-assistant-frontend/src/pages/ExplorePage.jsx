import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideMenuWhole from "../components/SideMenuComponents/SideMenuWhole";
import { fetchExploreSuggestions } from "../utilities/useExplore";
import { usePreferences } from "../utilities/usePreferences";
import { RefreshCw } from "lucide-react";

function getTripDays(preferences, fallback = 5) {
  const min = preferences?.tripDurationMin;
  const max = preferences?.tripDurationMax;
  if (min != null && max != null)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  return fallback;
}

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

function useDestinationPhoto(city, country) {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const query = encodeURIComponent(`${city} ${country} travel`);
    fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`)
      .then((res) => res.json())
      .then((data) => setPhoto(data.results?.[0]?.urls?.regular ?? null))
      .catch(() => setPhoto(null));
  }, [city, country]);

  return photo;
}

function DestinationCard({ dest, onPlanTrip }) {
  const photo = useDestinationPhoto(dest.city, dest.country);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="h-40 relative overflow-hidden bg-gray-100">
        {photo ? (
          <img src={photo} alt={dest.city} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full animate-pulse bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30">
          {dest.category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <p className="text-base font-semibold text-gray-900">{dest.city}</p>
          <p className="text-xs text-gray-400">{dest.country}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(dest.tags ?? []).map((tag) => (
            <span key={tag} className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed flex-1">{dest.reason}</p>
        <button
          onClick={() => onPlanTrip(dest)}
          className="w-full mt-1 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          Plan this trip
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="flex gap-1.5">
          <div className="h-5 bg-gray-100 rounded-full w-14" />
          <div className="h-5 bg-gray-100 rounded-full w-16" />
          <div className="h-5 bg-gray-100 rounded-full w-12" />
        </div>
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
        <div className="h-8 bg-gray-100 rounded-xl mt-2" />
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const { preferences, loading: prefsLoading } = usePreferences();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchExploreSuggestions();
      setDestinations(data?.destinations ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handlePlanTrip = (dest) => {
    const days = getTripDays(preferences);
    const prompt = `Plan a ${days}-day trip to ${dest.city}, ${dest.country}`;
    sessionStorage.removeItem("currentChatId");
    sessionStorage.removeItem("currentMessages");
    sessionStorage.removeItem("activeTrip");
    navigate("/chat", { state: { prompt, chatTitle: `${dest.city}, ${dest.country}`, initialChatId: null } });
  };

  const handleChatSelect = (chatId) => {
    sessionStorage.removeItem("currentMessages");
    sessionStorage.removeItem("activeTrip");
    sessionStorage.setItem("currentChatId", String(chatId));
    navigate("/chat", { state: { initialChatId: chatId } });
  };

  const handleNewChat = (chatId) => {
    sessionStorage.removeItem("currentChatId");
    sessionStorage.removeItem("currentMessages");
    sessionStorage.removeItem("activeTrip");
    navigate("/chat", { state: { initialChatId: chatId ?? null } });
  };

  const prefPills = [
    preferences?.homeCity && { label: preferences.homeCity, icon: "🏠" },
    preferences?.preferredCurrency && { label: preferences.preferredCurrency, icon: "💱" },
    preferences?.budgetRange && { label: preferences.budgetRange, icon: "💰" },
    preferences?.tripDurationMin != null && preferences?.tripDurationMax != null && { label: `${preferences.tripDurationMin}–${preferences.tripDurationMax} days`, icon: "📅" },
    preferences?.tripPace && { label: preferences.tripPace, icon: "⏱️" },
    preferences?.travelCompanions && { label: preferences.travelCompanions, icon: "👥" },
    preferences?.travelStyles && { label: preferences.travelStyles, icon: "✨" },
    preferences?.accommodationStyle && { label: preferences.accommodationStyle, icon: "🏨" },
    preferences?.mealPreference && { label: preferences.mealPreference, icon: "🍽️" },
  ].filter(Boolean);

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenuWhole onNewChat={handleNewChat} onChatSelect={handleChatSelect} />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-5xl mx-auto px-8 py-8">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Explore destinations</h1>
              <p className="text-sm text-gray-400 mt-0.5">Personalised suggestions based on your preferences</p>
            </div>
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Regenerate
            </button>
          </div>

          {!prefsLoading && prefPills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {prefPills.map((pill) => (
                <span key={pill.label} className="text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1">
                  {pill.icon} {pill.label}
                </span>
              ))}
              <button
                onClick={() => navigate("/editprofile")}
                className="text-xs text-gray-400 bg-white border border-dashed border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                ✏️ Edit preferences
              </button>
            </div>
          )}

          {!prefsLoading && prefPills.length === 0 && (
            <div className="mb-6 bg-white border border-dashed border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-400">Add travel preferences to get personalised suggestions</p>
              <button
                onClick={() => navigate("/editprofile")}
                className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Set preferences
              </button>
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm mb-3">Something went wrong loading suggestions.</p>
              <button onClick={load} className="text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer">
                Try again
              </button>
            </div>
          )}

          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : destinations.map((dest, i) => (
                    <DestinationCard key={i} dest={dest} onPlanTrip={handlePlanTrip} />
                  ))
              }
            </div>
          )}

        </div>
      </div>
    </div>
  );
}