import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePost from './Pages/createPost';
import Feed from './Pages/feed';
import Postcard from './Pages/postcard'
import Register from "./Pages/register.jsx"
import Login from "./Pages/login.jsx"
import Comments from "./Pages/comments.jsx"
import CurrProfile from "./Pages/currentProfile.jsx"
import UserProfile from "./Pages/userProfile.jsx"
import "./index.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/" element={<Feed />} />
        <Route path="/:id" element={<Postcard />} />
        <Route path="/:id/comments" element={<Comments />} />
        <Route path='/profile/:id' element={<UserProfile/>} />
        <Route path='/my-profile' element={<CurrProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App 
