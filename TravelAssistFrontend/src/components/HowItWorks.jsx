export function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-linear-to-br from-pink-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From idea to itinerary in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <Step
            number="1"
            title="Describe Your Trip"
            description="Share your destination, dates, budget, and preferences. Be as detailed or casual as you like."
            gradient="from-pink-400 to-orange-400"
          />
          <Step
            number="2"
            title="AI Creates Your Plan"
            description="Our AI analyzes thousands of options to build a personalized itinerary that matches your style."
            gradient="from-orange-400 to-yellow-400"
          />
          <Step
            number="3"
            title="Book & Travel"
            description="Review, adjust, and book everything in one place. Share with travel companions and enjoy!"
            gradient="from-yellow-400 to-pink-400"
          />
        </div>
      </div>
    </section>
  );
}

function Step({ number, title, description, gradient }) {
  return (
    <div className="text-center">
      <div className={`w-16 h-16 bg-linear-to-br ${gradient} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6`}>
        {number}
      </div>
      <h3 className="text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}