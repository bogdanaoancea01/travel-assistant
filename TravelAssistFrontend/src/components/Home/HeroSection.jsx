import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 bg-linear-to-b from-orange-50/40 via-orange-50/20 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl">
            Plan your next adventure
            <br />
            with <span className="italic">mindtrip</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized travel recommendations powered by AI. Create custom
            itineraries, discover hidden gems, and explore the world your way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              size="lg"
              className="bg-black text-white hover:bg-gray-800 rounded-full px-8"
            >
              Start planning
            </button>
            <button size="lg" variant="outline" className="rounded-full px-8">
              Explore destinations
            </button>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-white rounded-full shadow-lg p-2 flex items-center gap-2 border border-gray-200">
              <Search className="w-5 h-5 text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="flex-1 outline-none px-2 py-2 text-base"
              />
              <button className="rounded-full bg-black text-white hover:bg-gray-800">
                Search
              </button>
            </div>
          </div>

          {/* Popular destinations */}
          <div className="pt-8">
            <p className="text-sm text-gray-500 mb-4">Popular destinations</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {["Paris", "Tokyo", "New York", "Bali", "Iceland", "Dubai"].map(
                (city) => (
                  <button
                    key={city}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-gray-400 transition-colors"
                  >
                    {city}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
