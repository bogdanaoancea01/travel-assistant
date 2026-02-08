import { Plus, Smile, AtSign, Mic, Send } from "lucide-react";

export function HowItWorksSection() {
  const activities = [
    {
      icon: "💆",
      label: "Spa / Wellness",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300",
    },
    {
      icon: "🎭",
      label: "Theater",
      image:
        "https://images.unsplash.com/photo-1503095396549-807759245b35?w=300",
    },
    {
      icon: "🏖️",
      label: "Beach",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300",
    },
    {
      icon: "🦁",
      label: "Wildlife",
      image:
        "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=300",
    },
    {
      icon: "🏨",
      label: "Resorts",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300",
    },
    {
      icon: "🍽️",
      label: "Fine Dining",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300",
    },
    {
      icon: "🏰",
      label: "Historical Tours",
      image:
        "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=300",
    },
    {
      icon: "🏊",
      label: "Water Sports",
      image:
        "https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=300",
    },
    {
      icon: "🚴",
      label: "Cycling",
      image:
        "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=300",
    },
  ];

  return (
    <section className="py-20 bg-linear-to-b from-orange-50/30 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-4xl md:text-5xl mb-16">How it Works</h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Text and Description */}
          <div className="space-y-4">
            <h3 className="text-3xl md:text-4xl">
              Start chatting
              <br />
              with us.
            </h3>
            <p className="text-gray-600 max-w-md">
              Ask us for suggestions for any destination or ask us for an entire
              itinerary. Be as specific as you can about the types of
              experiences that you like or take our quiz to determine your
              travel style.
            </p>
          </div>

          {/* Right side - Chat Interface with Activity Cards */}
          <div className="relative">
            {/* Activity Cards scattered around */}
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Profile Image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Activity cards positioned around the profile */}
              <div className="absolute top-8 left-8 bg-white rounded-xl shadow-md overflow-hidden w-28 h-28">
                <img
                  src={activities[0].image}
                  alt={activities[0].label}
                  className="w-full h-20 object-cover"
                />
                <p className="text-xs px-2 py-1 truncate">
                  {activities[0].icon} {activities[0].label}
                </p>
              </div>

              <div className="absolute top-4 right-12 bg-white rounded-xl shadow-md overflow-hidden w-28 h-28">
                <img
                  src={activities[1].image}
                  alt={activities[1].label}
                  className="w-full h-20 object-cover"
                />
                <p className="text-xs px-2 py-1 truncate">
                  {activities[1].icon} {activities[1].label}
                </p>
              </div>

              <div className="absolute top-20 right-4 bg-white rounded-xl shadow-md overflow-hidden w-28 h-28">
                <img
                  src={activities[2].image}
                  alt={activities[2].label}
                  className="w-full h-20 object-cover"
                />
                <p className="text-xs px-2 py-1 truncate">
                  {activities[2].icon} {activities[2].label}
                </p>
              </div>

              <div className="absolute top-32 right-16 bg-white rounded-xl shadow-md overflow-hidden w-28 h-28">
                <img
                  src={activities[3].image}
                  alt={activities[3].label}
                  className="w-full h-20 object-cover"
                />
                <p className="text-xs px-2 py-1 truncate">
                  {activities[3].icon} {activities[3].label}
                </p>
              </div>

              <div className="absolute top-8 left-32 bg-white rounded-xl shadow-md overflow-hidden w-28 h-28">
                <img
                  src={activities[4].image}
                  alt={activities[4].label}
                  className="w-full h-20 object-cover"
                />
                <p className="text-xs px-2 py-1 truncate">
                  {activities[4].icon} {activities[4].label}
                </p>
              </div>

              <div className="absolute bottom-20 right-8 bg-white rounded-xl shadow-md overflow-hidden w-28 h-28">
                <img
                  src={activities[5].image}
                  alt={activities[5].label}
                  className="w-full h-20 object-cover"
                />
                <p className="text-xs px-2 py-1 truncate">
                  {activities[5].icon} {activities[5].label}
                </p>
              </div>

              <div className="absolute bottom-24 left-4 bg-white rounded-xl shadow-md overflow-hidden w-28 h-28">
                <img
                  src={activities[6].image}
                  alt={activities[6].label}
                  className="w-full h-20 object-cover"
                />
                <p className="text-xs px-2 py-1 truncate">
                  {activities[6].icon} {activities[6].label}
                </p>
              </div>

              <div className="absolute bottom-8 left-24 bg-white rounded-xl shadow-md overflow-hidden w-28 h-28">
                <img
                  src={activities[7].image}
                  alt={activities[7].label}
                  className="w-full h-20 object-cover"
                />
                <p className="text-xs px-2 py-1 truncate">
                  {activities[7].icon} {activities[7].label}
                </p>
              </div>

              <div className="absolute bottom-32 left-36 bg-white rounded-xl shadow-md overflow-hidden w-28 h-28">
                <img
                  src={activities[8].image}
                  alt={activities[8].label}
                  className="w-full h-20 object-cover"
                />
                <p className="text-xs px-2 py-1 truncate">
                  {activities[8].icon} {activities[8].label}
                </p>
              </div>

              {/* Chat Input */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full border border-gray-300 shadow-lg p-3 flex items-center gap-2">
                <Plus className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ask us anything..."
                  className="flex-1 outline-none text-sm"
                />
                <Smile className="w-5 h-5 text-gray-400" />
                <AtSign className="w-5 h-5 text-gray-400" />
                <Mic className="w-5 h-5 text-gray-400" />
                <button className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
