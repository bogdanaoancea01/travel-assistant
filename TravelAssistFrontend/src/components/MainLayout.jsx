import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const onNavigate = (route) => {
    navigate(route.startsWith("/") ? route : `/${route}`);
  };

  return (
    <>
      <Navbar
        brand="TravelAI"
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((v) => !v)}
        onNavigate={onNavigate}
        icons={{ Globe, Menu, X }}
      />
      <Outlet />
    </>
  );
}
