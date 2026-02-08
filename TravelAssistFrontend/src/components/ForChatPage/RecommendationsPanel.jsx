import { ChevronLeft, ChevronRight, MapIcon } from "lucide-react";

// Destination card data
const destinations = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1607403218119-83b4df4c0959?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBjdWlzaW5lJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzAyMjI4OTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "La Cuptor Restaurant",
    subtitle: "in French",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1750748305395-5fc18cb35f2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWJpdSUyMHJvbWFuaWElMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcwMjIyOTgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "The Bridge of Lies",
    subtitle: "in Attraction",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1728160473324-e4a4969a9e19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJpbiUyMGl0YWx5JTIwbmlnaHR8ZW58MXx8fHwxNzcwMjIyOTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "La Turin",
    subtitle: "in European",
  },
];

// Inspiration article cards
const inspirationCards = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1750748305395-5fc18cb35f2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWJpdSUyMHJvbWFuaWElMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcwMjIyOTgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Sibiu Revealed: Unveiling the Hidden Charms of a...",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1673707379504-ca39c5d826ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGluYnVyZ2glMjBzY290bGFuZCUyMGNpdHl8ZW58MXx8fHwxNzcwMTM3MDcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Edinburgh's 3 Day Itinerary",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1761610777279-8f59e1e24a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWF0dGxlJTIwc2t5bGluZSUyMG1vZGVybnxlbnwxfHx8fDE3NzAyMjI4OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Seattle for the Dreamers | A Modern Guide",
  },
];

// Tools card data
const tools = [
  {
    id: 1,
    title: "Create a Trip",
    subtitle: "in French",
  },
  {
    id: 2,
    title: "Take travel test",
    subtitle: "in Attraction",
  },
];

export function RecommendationsPanel() {
  return (
    <div className="bg-white px-6 py-4 overflow-y-auto h-screen">
      {/* Header with location and view toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">For you in</h2>
          <div className="flex items-center gap-1 text-gray-700 font-medium">
            Sibiu
          </div>
        </div>
        {/* Map/List toggle */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
            <MapIcon className="size-4" />
          </button>
          <span className="text-sm text-gray-600">Map</span>
        </div>
      </div>

      {/* Destinations carousel */}
      <div className="mb-8">
        <div className="relative">
          {/* Carousel navigation buttons */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="size-4" />
          </button>

          {/* Scrollable destinations container */}
          <div className="flex gap-4 overflow-hidden snap-x snap-mandatory pb-2">
            {destinations.map((destination) => (
              <div key={destination.id} className="shrink-0 w-55 snap-start">
                <div className="relative rounded-xl overflow-hidden group cursor-pointer">
                  {/* Destination image */}
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Destination info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <p className="text-sm font-medium leading-tight mb-0.5">
                      {destination.title}
                    </p>
                    <p className="text-xs text-white/90">
                      {destination.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Get inspired section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Get inspired</h3>
          <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            See all
          </button>
        </div>
        {/* Inspiration cards carousel */}
        <div className="relative">
          {/* Carousel navigation buttons */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="size-4" />
          </button>

          {/* Tools cards container */}
          <div className="flex gap-4 overflow-hidden snap-x snap-mandatory pb-10">
            {inspirationCards.map((card) => (
              <div key={card.id} className="shrink-0 w-55 snap-start">
                <div className="relative rounded-xl overflow-hidden group cursor-pointer">
                  {/* Card image */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Card title */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <p className="text-sm font-medium leading-tight">
                      {card.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tools section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Get started with TravelAI</h3>
        </div>

        {/* Scrollable inspiration cards container */}
        <div className="flex gap-10 overflow-hidden snap-x snap-mandatory pb-2">
          {tools.map((card) => (
            <div key={card.id} className="shrink-0 w-62 snap-start">
              <div className="relative rounded-xl overflow-hidden group cursor-pointer">
                {/* Card image */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 rounded-xl bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                {/* Card title */}
                <div className=" bottom-0 left-0 right-0 p-3 text-white">
                  <p className="text-sm font-medium leading-tight">
                    {card.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
