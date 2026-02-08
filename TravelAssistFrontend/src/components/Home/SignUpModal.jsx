import { X } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export function SignUpModal({ isOpen, onClose, onSignInClick }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend safety check (UX)
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://localhost:7237/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend validation errors
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          alert(firstError);
        } else {
          alert(data);
        }
        return;
      }

      // Success
      console.log("Signup success:", data);
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google sign up");
  };

  const handleFacebookSignUp = () => {
    console.log("Facebook sign up");
  };

  const handleAppleSignUp = () => {
    console.log("Apple sign up");
  };

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
          relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl
          transform transition-all duration-300
          ${
            isOpen
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-95 translate-y-6 opacity-0"
          }
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

          <h2 className="mb-2 text-3xl font-semibold">Welcome to TravelAI</h2>
          <p className="text-gray-600">Sign up to start your journey with us</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* First name */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="First name"
                className="w-full rounded-lg border px-4 py-3"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            {/* Last name */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Last name"
                className="w-full rounded-lg border px-4 py-3"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="relative">
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
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
          <div className="relative">
            <label className="mb-1 block text-sm font-medium">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9.5 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-black py-4 text-white hover:bg-gray-800 cursor-pointer"
          >
            Sign up
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

        {/* Social signup */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignUp}
            className="w-full rounded-full border py-4 hover:bg-gray-50 cursor-pointer"
          >
            Continue with Google
          </button>
          <button
            onClick={handleFacebookSignUp}
            className="w-full rounded-full border py-4 hover:bg-gray-50 cursor-pointer"
          >
            Continue with Facebook
          </button>
          <button
            onClick={handleAppleSignUp}
            className="w-full rounded-full border py-4 hover:bg-gray-50 cursor-pointer"
          >
            Continue with Apple
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSignInClick}
            className="font-semibold text-black hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

SignUpModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSignInClick: PropTypes.func.isRequired,
};
