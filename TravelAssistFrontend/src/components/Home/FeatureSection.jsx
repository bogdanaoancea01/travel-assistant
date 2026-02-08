import { Heart, ThumbsUp, ThumbsDown, Play } from "lucide-react";

export function FeatureSection() {
  return (
    <section className="py-20 bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl md:text-5xl mb-4 max-w-3xl mx-auto">
          Everything you need
          <br />
          for your next adventure
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mt-16">
          {/* Left side - Text */}
          <div className="space-y-4">
            <h3 className="text-3xl md:text-4xl">
              Photos, maps +<br />
              reviews
            </h3>
            <p className="text-gray-600 max-w-md">
              Don't just read about a place, experience it. With vibrant photos,
              interactive maps and reviews, you'll feel like you're already
              there.
            </p>
          </div>

          {/* Right side - Visual representation */}
          <div className="relative">
            <div className="relative w-full max-w-xl mx-auto">
              {/* Map background */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800"
                  alt="Map"
                  className="w-full h-full object-cover opacity-40 rounded-2xl"
                />
              </div>

              {/* Layered cards */}
              <div className="relative p-8">
                {/* Location card with heart */}
                <div className="relative mb-4 ml-8 w-64 bg-white rounded-xl shadow-2xl overflow-hidden">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=400"
                      alt="Plaza de España"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-black rounded-full mt-1.5"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full mt-1.5"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full mt-1.5"></div>
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="text-gray-500">Seville</p>
                      <p className="text-xs text-gray-400">
                        Description of the location goes here...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video card */}
                <div className="absolute top-16 right-8 w-48 bg-white rounded-xl shadow-xl overflow-hidden">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300"
                      alt="Sunset"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-black ml-1" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Heart className="w-5 h-5 text-blue-500 fill-blue-500" />
                    </div>
                  </div>
                  <div className="p-2 text-xs">
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 bg-black rounded-full mt-1"></div>
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1"></div>
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1"></div>
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1"></div>
                    </div>
                  </div>
                </div>

                {/* Reviews card */}
                <div className="absolute bottom-8 right-4 w-52 bg-white rounded-xl shadow-2xl p-4">
                  <p className="text-sm mb-2">Reviews</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl">4.9</span>
                    <span className="text-sm text-gray-600 mb-1">
                      Excellent
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">2,172 reviews</p>
                  <div className="mt-3 pt-3 border-t flex gap-2">
                    <button className="flex-1 py-2 border rounded-lg flex items-center justify-center gap-1 hover:bg-gray-50">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs">Pros</span>
                    </button>
                    <button className="flex-1 py-2 border rounded-lg flex items-center justify-center gap-1 hover:bg-gray-50">
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-xs">Cons</span>
                    </button>
                  </div>
                </div>

                {/* Map overlay card */}
                <div className="absolute top-32 left-16 w-56 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-3">
                  <div className="flex gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=100"
                      alt="Paris"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-1 mb-1">
                        <div className="w-1.5 h-1.5 bg-black rounded-full mt-1"></div>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1"></div>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1"></div>
                      </div>
                      <p className="text-xs truncate">Prague</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
