export function QuizSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=100"
                alt="Luxury outdoor pools surrounded by nature"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right side - Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl">
              What kind of
              <br />
              traveler are you?
            </h2>

            <p className="text-base md:text-lg text-gray-600 max-w-md">
              Take our quick travel quiz. We'll reveal your travel style and use
              your personal preferences to provide you with recommendations
              you'll love.
            </p>

            <div className="pt-2">
              <button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 text-base"
              >
                Take our quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
