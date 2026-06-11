import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideMenuWhole from "../components/SideMenuComponents/SideMenuWhole";
import { fetchSavedDestinations, removeDestinationInteraction } from "../utilities/useExplore";
import { usePreferences } from "../utilities/usePreferences";
import { Trash2, Heart } from "lucide-react";

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

function SavedCard({ dest, onPlanTrip, onRemove }) {
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
        <button
          onClick={() => onRemove(dest)}
          title="Remove from saved"
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 text-gray-500 hover:text-red-500 hover:bg-white transition-colors cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
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
          className="w-full py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-700 transition-colors cursor-pointer"
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
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-8 bg-gray-100 rounded-xl mt-2" />
      </div>
    </div>
  );
}

export default function SavedPage() {
  const navigate = useNavigate();
  const { preferences } = usePreferences();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchSavedDestinations();
      setSaved(data ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRemove = async (dest) => {
    const prev = saved;
    setSaved((s) => s.filter((d) => !(d.city === dest.city && d.country === dest.country)));
    try {
      await removeDestinationInteraction(dest);
    } catch {
      setSaved(prev); // revert
    }
  };

  const getTripDays = () => {
    const min = preferences?.tripDurationMin, max = preferences?.tripDurationMax;
    if (min != null && max != null) return Math.floor(Math.random() * (max - min + 1)) + min;
    return 5;
  };

  const handlePlanTrip = (dest) => {
    const days = getTripDays();
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

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenuWhole onNewChat={handleNewChat} onChatSelect={handleChatSelect} />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-5xl mx-auto px-8 py-8">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Saved destinations</h1>
              <p className="text-sm text-gray-400 mt-0.5">Places you bookmarked to plan later</p>
            </div>
            <button
              onClick={() => navigate("/explore")}
              className="text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Explore more
            </button>
          </div>

          {error && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm mb-3">Something went wrong loading your saved places.</p>
              <button onClick={load} className="text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer">
                Try again
              </button>
            </div>
          )}

          {!error && loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!error && !loading && saved.length === 0 && (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm mb-1">No saved destinations yet</p>
              <p className="text-gray-400 text-xs mb-4">Tap the bookmark on any destination in Explore to save it here.</p>
              <button
                onClick={() => navigate("/explore")}
                className="text-xs font-medium text-white bg-gray-900 rounded-full px-4 py-2 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Go to Explore
              </button>
            </div>
          )}

          {!error && !loading && saved.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {saved.map((dest, i) => (
                <SavedCard key={dest.city + dest.country + i} dest={dest} onPlanTrip={handlePlanTrip} onRemove={handleRemove} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
