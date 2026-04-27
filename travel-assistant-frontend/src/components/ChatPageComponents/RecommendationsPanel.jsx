import Card from "../RecommendationPanel/Card";
import SectionHeader from "../RecommendationPanel/SectionHeader";
import Carousel from "../RecommendationPanel/Carousel";

// Destination card data
const destinationsCards = [
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
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1607403218119-83b4df4c0959?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBjdWlzaW5lJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzAyMjI4OTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "La Cuptor Restaurant",
    subtitle: "in French",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1750748305395-5fc18cb35f2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWJpdSUyMHJvbWFuaWElMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzcwMjIyOTgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "The Bridge of Lies",
    subtitle: "in Attraction",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1728160473324-e4a4969a9e19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJpbiUyMGl0YWx5JTIwbmlnaHR8ZW58MXx8fHwxNzcwMjIyOTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "La Turin",
    subtitle: "in European",
  },
];

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
const toolCards = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1673707379504-ca39c5d826ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGluYnVyZ2glMjBzY290bGFuZCUyMGNpdHl8ZW58MXx8fHwxNzcwMTM3MDcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Create a Trip",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1761610777279-8f59e1e24a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWF0dGxlJTIwc2t5bGluZSUyMG1vZGVybnxlbnwxfHx8fDE3NzAyMjI4OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Take travel test",
  },
];

export default function RecommendationsPanel() {
  return (
    <div className="bg-white px-6 py-25 overflow-y-auto h-screen">
      {/* For You Section */}
      <SectionHeader
        title="For you in Sibiu"
        link={
          <div className="text-sm text-gray-600 hover:text-black cursor-pointer">
            See on map
          </div>
        }
      />
      <div className="flex gap-8 overflow-hidden pb-4 group">
        <Carousel>
          {destinationsCards.map((card) => (
            <Card
              key={card.id}
              title={card.title}
              image={card.image}
              subtitle={card.subtitle}
            />
          ))}
        </Carousel>
      </div>

      {/* Get Inspired Section */}
      <SectionHeader
        title="Get inspired"
        link={
          <div className="text-sm text-gray-600 hover:text-black cursor-pointer">
            See more
          </div>
        }
      />
      <div className="flex gap-8 overflow-hidden pb-4 group">
        <Carousel>
          {inspirationCards.map((card) => (
            <Card
              key={card.id}
              title={card.title}
              image={card.image}
              subtitle={card.subtitle}
            />
          ))}
        </Carousel>
      </div>

      {/* Tools Section */}
      <SectionHeader title="Get started with TravelAI" />
      <div className="flex gap-8 overflow-hidden pb-4 group">
        {toolCards.map((toolCard) => (
          <Card
            key={toolCard.id}
            image={toolCard.image}
            title={toolCard.title}
            subtitle={toolCard.subtitle}
          />
        ))}
      </div>
    </div>
  );
}
