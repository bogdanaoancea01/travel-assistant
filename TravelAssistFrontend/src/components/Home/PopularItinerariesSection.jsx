import { Heart, Bookmark } from "lucide-react";

export function PopularItinerariesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Itinerary Card Preview */}
          <div className="relative">
            <div className="bg-gray-100 rounded-2xl p-8 max-w-md">
              {/* Main Card */}
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600"
                    alt="Elk, California"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      <Heart className="w-4 h-4 text-blue-500 fill-blue-500" />
                    </button>
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-sm font-semibold">
                        Explore Elk, California
                      </p>
                      <p className="text-xs text-gray-600">
                        by Michael · Feb 3-6
                      </p>
                    </div>
                  </div>
                </div>

                {/* Small thumbnails */}
                <div className="p-4 flex gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100"
                    alt="Thumbnail 1"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=100"
                    alt="Thumbnail 2"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="px-4 pb-4 space-y-3">
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt...
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Outdoors
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Nature
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Romantic
                    </span>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-full"
                    >
                      ✨ Customize a trip
                    </button>
                    <button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-full"
                    >
                      ❤️ Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Text */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl">Popular itineraries.</h2>
            <p className="text-gray-600 max-w-md">
              Visit our <span className="underline">inspiration page</span> to
              get ideas and inspiration from other Mindtrippers. Add their
              suggestions to a new trip plan and customize it to make it your
              own.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
