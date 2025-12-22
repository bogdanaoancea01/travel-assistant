import React from 'react'
import Home from './pages/Home'
import About from './pages/About'
import {SignIn} from './pages/SignIn'
import {SignUp} from './pages/SignUp'
import {NewTrip} from './pages/NewTrip'
import NotFound from './pages/NotFound'
import User from './components/user/User'
import { Routes, Route } from "react-router";
import { Toaster } from 'react-hot-toast';
import MainLayout from "./components/MainLayout";



const App = () => {
  return (
    <>
      <Routes>
        
        {/* With navbar */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="user" element={<User />} />
          <Route path="newTrip" element={<NewTrip />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
        </Route>

        {/* Without navbar */}
        <Route path="*" element={<NotFound />} />
    </Routes>


      <Toaster />
    </>
  )
}

export default App