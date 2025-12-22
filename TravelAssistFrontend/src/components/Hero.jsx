import { useNavigate } from "react-router-dom";

export function Hero({ icons }) {
  const { Sparkles, ArrowRight, Star } = icons;
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-20 px-4 bg-linear-to-br from-pink-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge Sparkles={Sparkles} />

          <h1 className="mb-6">
            Plan Your Perfect Trip<br />
            <span className="bg-linear-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            In Minutes, Not Hours
            </span>
          </h1>

          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            Describe your dream vacation and let our AI copilot create personalized itineraries with flights, hotels,
            activities, and recommendations—tailored to your style and budget.
          </p>

          <HeroActions navigate={navigate} ArrowRight={ArrowRight} />

          <HeroStats Star={Star} />
        </div>
      </div>
    </section>
  );
}

function Badge({ Sparkles }) {
  return (
    <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-6 shadow-sm">
      <Sparkles className="w-4 h-4 text-orange-500" />
      <span className="text-sm text-gray-700">AI-powered travel planning</span>
    </div>
  );
}

function HeroActions({navigate, ArrowRight }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
      <button
        onClick={() => navigate("/newtrip")}
        className="bg-linear-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-xl cursor-pointer hover:shadow-xl transition-all flex items-center gap-2 group"
      >
        Start Planning
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <button
        onClick={() => navigate('/explore')}
        className="bg-white text-gray-900 px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-orange-500 cursor-pointer hover:shadow-lg transition-all"
      >
        Explore Destinations
      </button>
    </div>
  );
}

function HeroStats({ Star }) {  
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-400 to-orange-400 border-2 border-white" />
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-yellow-400 border-2 border-white" />
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-yellow-400 to-pink-400 border-2 border-white" />
        </div>
        <span>50,000+ travelers</span>
      </div>

      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        <span>4.9/5 rating</span>
      </div>

      <div>
        <span>120+ countries</span>
      </div>
    </div>
  );
}
