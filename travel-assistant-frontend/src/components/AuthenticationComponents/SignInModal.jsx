import { X, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import SocialMediaAuth from "./SocialMediaAuth";

export default function SignInModal({ isOpen, onClose, onSignUpClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();


 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(
      "https://localhost:7063/api/authentication/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          passwordHash: password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data);
      return;
    }
    login(data.token);
    onClose();

  } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
};

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center p-4
                transition-opacity duration-400 backdrop-blur-xs bg-black/60
                ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
              `}
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className={`
          relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : " opacity-0 pointer-events-none"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 transition hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-2">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-xl font-semibold">TravelAI</span>
          </div>

          <h2 className="mb-2 text-3xl font-semibold">Welcome back</h2>
          <p className="text-gray-600">Sign in to continue your journey</p>
        </div>

        {/* SignIn Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="relative">
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9.5 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-gray-600 hover:text-black">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-black py-4 text-white transition hover:bg-gray-800 cursor-pointer"
            onClick={handleSubmit}
          >
            Log in
          </button>
        </form>

        {/* Social Media Auth */}
        <SocialMediaAuth />

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSignUpClick}
            className="font-semibold text-black hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
