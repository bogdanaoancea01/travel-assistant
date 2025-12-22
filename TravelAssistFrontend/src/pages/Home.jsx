import {
  ArrowRight,
  Calendar,
  Check,
  Globe,
  MapPin,
  Menu,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react';
import { Footer } from "../components/Footer";
import { HowItWorks } from '../components/HowItWorks';
import { Hero } from '../components/Hero';

const Home = () => {
  const onNavigate = (route) => {
    console.log("Navigate to:", route);
  };

  return (
    <div className="min-h-screen flex flex-col">
     
      <Hero onNavigate={onNavigate} icons={{ Sparkles, ArrowRight, Star }} />

      <HowItWorks />

      <Footer brand="TravelAI" icons={{ Globe }} onNavigate={onNavigate} />
    </div>
  );
};

export default Home;
