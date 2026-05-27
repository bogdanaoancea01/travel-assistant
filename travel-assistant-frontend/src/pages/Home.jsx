import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderSection from "../components/Home/HeaderSection";
import HeroSection from "../components/Home/HeroSection";
import HowItWorksSection from "../components/Home/HowItWorksSection";
import PopularItinerariesSection from "../components/Home/PopularItinerariesSection";
import FeatureSection from "../components/Home/FeatureSection";
import Footer from "../components/Home/FooterSection";
import QuizSection from "../components/Home/QuizSection";
import SignInModal from "../components/AuthenticationComponents/SignInModal";
import SignUpModal from "../components/AuthenticationComponents/SignUpModal";
import MenuModal from "../components/Home/MenuModal";
import { useChatHistory } from "../utilities/useChatHistory";

const Home = () => {
  const [authModal, setAuthModal] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState(null);
  const [pendingChat, setPendingChat] = useState(false);
  const navigate = useNavigate();
  const { createChat } = useChatHistory();

  const handleSignInSuccess = async () => {
    setAuthModal(null);
    if (pendingPrompt) {
      const chat = await createChat("New Chat");
      navigate("/chat", { state: { prompt: pendingPrompt, initialChatId: chat?.id } });
      setPendingPrompt(null);
    } else if (pendingChat) {
      const chat = await createChat("New Chat");
      navigate("/chat", { state: { initialChatId: chat?.id } });
      setPendingChat(false);
    }
  };

  return (
    <div>
      <HeaderSection
        onSignInClick={() => setAuthModal("signin")}
        onMenuClick={() => setIsMenuOpen(true)}
      />
      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}
        onAuthRequired={(prompt) => {
          if (prompt) {
            setPendingPrompt(prompt);
          } else {
            setPendingChat(true);
          }
          setAuthModal("signin");
        }}
      />
      <SignInModal
        isOpen={authModal === "signin"}
        onClose={() => setAuthModal(null)}
        onSignUpClick={() => setAuthModal("signup")}
        onLoginSuccess={handleSignInSuccess}
      />
      <SignUpModal
        isOpen={authModal === "signup"}
        onClose={() => setAuthModal(null)}
        onSignInClick={() => setAuthModal("signin")}
        onSignUpSuccess={handleSignInSuccess}
      />
      <HeroSection
        onAuthRequired={(prompt) => {
          if (prompt) {
            setPendingPrompt(prompt);
          } else {
            setPendingChat(true);
          }
          setAuthModal("signin");
        }}
      />
      <HowItWorksSection />
      <PopularItinerariesSection />
      <FeatureSection />
      <QuizSection />
      <Footer />
    </div>
  );
};

export default Home;
