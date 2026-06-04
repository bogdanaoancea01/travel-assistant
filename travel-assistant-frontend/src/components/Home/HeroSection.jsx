import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useChatHistory } from "../../utilities/useChatHistory";

export default function HeroSection({ onAuthRequired }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const { createChat } = useChatHistory();

  const handleStartPlanning = async () => {
    sessionStorage.removeItem("currentChatId");
    sessionStorage.removeItem("currentMessages");
    sessionStorage.removeItem("activeTrip");

    if (user) {
      const chat = await createChat("New Chat");
      navigate("/chat", { state: { initialChatId: chat?.id } });
    } else {
      onAuthRequired?.(null);
    }
  };

  const handleSearch = async () => {
    const text = searchValue.trim();
    if (!text) return;

    sessionStorage.removeItem("currentChatId");
    sessionStorage.removeItem("currentMessages");
    sessionStorage.removeItem("activeTrip");

    if (user) {
      const chat = await createChat("New Chat");
      navigate("/chat", { state: { prompt: text, initialChatId: chat?.id } });
    } else {
      onAuthRequired?.(text);
    }
  };

  const handleDestination = async (city) => {
    const prompt = `Plan a 5-day trip to ${city}`;

    sessionStorage.removeItem("currentChatId");
    sessionStorage.removeItem("currentMessages");
    sessionStorage.removeItem("activeTrip");

    if (user) {
      const chat = await createChat(city);
      navigate("/chat", { state: { prompt, initialChatId: chat?.id, chatTitle: city } });
    } else {
      onAuthRequired?.(prompt);
    }
  };

  return (
    <section className="pt-32 pb-20 bg-linear-to-b from-orange-50/40 via-orange-50/20 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl">
            Plan your next adventure
            <br />
            with <span className="italic">Meridian</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized travel recommendations powered by AI. Create custom
            itineraries, discover hidden gems, and explore the world your way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="px-8 py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => handleStartPlanning()}
            >
              Start planning
            </button>
            <button
              className="rounded-full px-6 py-2 font-semibold cursor-pointer hover:bg-gray-100"
              onClick={() => navigate("/explore")}
            >
              Explore destinations
            </button>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-white rounded-full shadow-lg p-2 flex items-center gap-2 border border-gray-200">
              <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                placeholder="Where do you want to go?"
                className="flex-1 outline-none px-2 py-2 text-base"
              />
              <button
                onClick={() => handleSearch()}
                className="px-3 py-1.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>

          {/* Popular destinations */}
          <div className="pt-8">
            <p className="text-sm text-gray-500 mb-4">Popular destinations</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {["Paris", "Tokyo", "New York", "Bali", "Iceland", "Dubai"].map((city) => (
                <button
                  key={city}
                  onClick={() => handleDestination(city)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-gray-400 transition-colors cursor-pointer"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}