import { useNavigate, useLocation } from "react-router-dom";
import SignInModal from "../components/AuthenticationComponents/SignInModal";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname ?? "/chat";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignInModal
        isOpen={true}
        onClose={() => navigate("/")}
        onSignUpClick={() => navigate("/signup", { state: { from: location.state?.from } })}
        redirectTo={from}
      />
    </div>
  );
}