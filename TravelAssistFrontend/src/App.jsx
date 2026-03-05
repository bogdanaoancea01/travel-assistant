import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import { Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />

        <Route path="home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="chat" element={<ChatPage />} />
      </Routes>

      <Toaster />
    </>
  );
};

export default App;
