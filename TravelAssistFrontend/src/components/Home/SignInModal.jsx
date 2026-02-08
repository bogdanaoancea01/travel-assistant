import { X } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function SignInModal({ isOpen, onClose, onSignUpClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call
    console.log("Sign in:", { email, password, rememberMe });
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign in");
  };

  const handleFacebookSignIn = () => {
    console.log("Google sign in");
  };

  const handleAppleSignIn = () => {
    console.log("Apple sign in");
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [isOpen]);

  return (
    <div
      className={`
        absolute inset-0 z-50 flex items-center justify-center p-4
        transition-opacity duration-400 backdrop-blur-xs bg-black/60
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className={`
          relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : " opacity-0 pointer-events-none"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
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

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-gray-600 hover:text-black">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-black py-4 text-white transition hover:bg-gray-800"
          >
            Log in
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social buttons */}
        <div className="space-y-3">
          <button
            className="flex w-full items-center justify-center gap-3 rounded-full border py-4 transition hover:bg-gray-50"
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </button>

          <button
            className="flex w-full items-center justify-center gap-3 rounded-full border py-4 transition hover:bg-gray-50"
            onClick={handleFacebookSignIn}
          >
            Continue with Facebook
          </button>

          <button
            className="flex w-full items-center justify-center gap-3 rounded-full border py-4 transition hover:bg-gray-50"
            onClick={handleAppleSignIn}
          >
            Continue with Apple
          </button>
        </div>

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

SignInModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSignUpClick: PropTypes.func.isRequired,
};
