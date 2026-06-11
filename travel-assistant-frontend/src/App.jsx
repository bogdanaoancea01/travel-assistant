import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import ExplorePage from "./pages/ExplorePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";
import QuizPage from "./pages/QuizPage";
import SavedPage from "./pages/SavedPage";
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
        <Route path="explore" element={
          <ProtectedRoute><ExplorePage /></ProtectedRoute>
        } />
        <Route path="quiz" element={
          <ProtectedRoute><QuizPage /></ProtectedRoute>
        } />
        <Route path="saved" element={
          <ProtectedRoute><SavedPage /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </>
  );
};

export default App;