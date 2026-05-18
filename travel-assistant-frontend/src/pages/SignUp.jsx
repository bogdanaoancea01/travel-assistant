import { useNavigate, useLocation } from "react-router-dom";
import SignUpModal from "../components/AuthenticationComponents/SignUpModal";

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname ?? "/chat";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUpModal
        isOpen={true}
        onClose={() => navigate("/")}
        onSignInClick={() => navigate("/signin", { state: { from: location.state?.from } })}
        redirectTo={from}
      />
    </div>
  );
}
