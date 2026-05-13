import GoogleSVG from "./GoogleSVG";
import FacebookSVG from "./FacebookSVG";
import AppleSVG from "./AppleSVG";

export default function SocialMediaAuth() {
    const handleGoogleSignIn = () => {
    console.log("Google sign in");
  };

  const handleFacebookSignIn = () => {
    console.log("Google sign in");
  };

  const handleAppleSignIn = () => {
    console.log("Apple sign in");
  };

  const socialButtons = [
    {
      id: "google",
      icon: <GoogleSVG />,
      description: "Continue with Google",
      handler: handleGoogleSignIn,
    },
    {
      id: "facebook",
      icon: <FacebookSVG />,
      description: "Continue with Facebook",
      handler: handleFacebookSignIn,
    },
    {
      id: "apple",
      icon: <AppleSVG />,
      description: "Continue with Apple",
      handler: handleAppleSignIn,
    },
  ];

    return (
        <div>
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
            {socialButtons.map((button) => (
                <button
                key={button.id}
                id={button.id}
                className="flex w-full items-center justify-center gap-3 rounded-full border py-4 transition hover:bg-gray-50"
                onClick={button.handler}
                >
                <span>{button.icon}</span>
                {button.description}
                </button>
            ))}
            </div>
        </div>
    );
}
