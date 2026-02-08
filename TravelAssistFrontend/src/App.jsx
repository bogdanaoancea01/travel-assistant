import React from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Chat } from "./pages/Chat";
import NotFound from "./pages/NotFound";
import User from "./components/user/User";
import { Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />

        <Route path="home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="chat" element={<Chat />} />
      </Routes>

      <Toaster />
    </>
  );
};

export default App;
