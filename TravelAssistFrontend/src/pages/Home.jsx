import { useState } from "react";
import { HeaderSection } from "../components/Home/HeaderSection";
import { HeroSection } from "../components/Home/HeroSection";
import { HowItWorksSection } from "../components/Home/HowItWorksSection";
import { PopularItinerariesSection } from "../components/Home/PopularItinerariesSection";
import { FeatureSection } from "../components/Home/FeatureSection";
import { Footer } from "../components/Home/FooterSection";
import { QuizSection } from "../components/Home/QuizSection";
import { SignInModal } from "../components/Home/SignInModal";
import { SignUpModal } from "../components/Home/SignUpModal";
import { MenuModal } from "../components/Home/MenuModal";

const Home = () => {
  const [authModal, setAuthModal] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <HeaderSection
        onSignInClick={() => setAuthModal("signin")}
        onMenuClick={() => setIsMenuOpen(true)}
      />
      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SignInModal
        isOpen={authModal === "signin"}
        onClose={() => setAuthModal(null)}
        onSignUpClick={() => setAuthModal("signup")}
      />
      <SignUpModal
        isOpen={authModal === "signup"}
        onClose={() => setAuthModal(null)}
        onSignInClick={() => setAuthModal("signin")}
      />
      <HeroSection />
      <HowItWorksSection />
      <PopularItinerariesSection />
      <FeatureSection />
      <QuizSection />
      <Footer />
    </div>
  );
};

export default Home;
