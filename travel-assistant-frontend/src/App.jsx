import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./utilities/ProtectedRoute";
import { Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />

        <Route path="chat" element={
          <ProtectedRoute><ChatPage /></ProtectedRoute>
        } />
        <Route path="editprofile" element={
          <ProtectedRoute><EditProfile /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </>
  );
};

export default App;