import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePost from './Pages/createPost';
import Feed from './Pages/feed';
import Postcard from './Pages/postcard'
import Register from "./Pages/register.jsx"
import UserPosts from "./Pages/userPosts.jsx"
import Login from "./Pages/login.jsx"
import Comments from "./Pages/comments.jsx"
import "./index.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:id" element={<Postcard />} />
        <Route path="/feed/:id/comments" element={<Comments />} />
        <Route path='/my-feed' element={<UserPosts />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
