import api from '../api/axios'
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  FiArrowLeft,
  FiGrid,
  FiLogOut,
  FiPlus,
  FiSearch
} from "react-icons/fi";

function CurrProfile() {
  const navigate = useNavigate()
  const [profileUsername, setProfileUsername] = useState("")
  const [profilePic, setProfilePic] = useState("")
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchedUsers, setSearchedUsers] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef(null)

  const [showAvatarModal, setShowAvatarModal] = useState(false)

  useEffect(() => {
    api.get("/api/user/get-user")
      .then((res) => {
        if (res.data.username) {
          setProfileUsername(res.data.username)
          setProfilePic(res.data.uri)
          setFollowers(res.data.followers.length)
          setFollowing(res.data.following.length)
        }
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    api.get("/api/user/user-posts")
      .then((res) => {
        setPosts(res.data.userPosts || [])
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // search users with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchedUsers([])
      setShowDropdown(false)
      return
    }

    const delay = setTimeout(() => {
      api.post(
        "/api/user/search-profiles",
        { search: searchQuery }
      )
        .then((res) => {
          setSearchedUsers(res.data.foundUser || [])
          setShowDropdown(true)
        })
        .catch((err) => console.log(err))
    }, 350)

    return () => clearTimeout(delay)
  }, [searchQuery])

  // close avatar modal on Escape key
  useEffect(() => {
    if (!showAvatarModal) return
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowAvatarModal(false)
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [showAvatarModal])

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout", {})
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-brand">Pixora</div>
        {/* User search with dropdown */}
        <div className="search-bar"  ref={searchRef} style={{ position: "relative" , left:"60px" }}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchedUsers.length > 0 && setShowDropdown(true)}
            placeholder="Search users…"
          />

          {/* Dropdown */}
          {showDropdown && searchedUsers.length > 0 && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              background: "rgba(13,20,37,0.97)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              backdropFilter: "blur(20px)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
              zIndex: 200,
              overflow: "hidden",
              maxHeight: 320,
              overflowY: "auto"
            }}>
              {searchedUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    setShowDropdown(false)
                    setSearchQuery("")
                    navigate(`/profile/${user._id}`)
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    borderBottom: "1px solid rgba(255,255,255,0.05)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(108,139,255,0.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6c8bff, #a78bfa)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "white",
                    flexShrink: 0,
                    overflow: "hidden"
                  }}>
                    {user.uri
                      ? <img src={user.uri} alt={user.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : user.username?.[0]?.toUpperCase()
                    }
                  </div>

                  <span style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#e8eaf6"
                  }}>
                    @{user.username}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {showDropdown && searchQuery.trim() && searchedUsers.length === 0 && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              background: "rgba(13,20,37,0.97)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              backdropFilter: "blur(20px)",
              padding: "14px",
              textAlign: "center",
              fontSize: 13,
              color: "#64748b",
              zIndex: 200
            }}>
              No users found
            </div>
          )}
        </div>
        <div className="navbar-right">

          <button
            className="btn-ghost"
            onClick={() => navigate(-1)}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <FiArrowLeft /> Back
          </button>

          <button
            className="btn-ghost"
            onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
             Feed
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <FiLogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      <div className="profile-page">

        {/* ── BANNER ── */}
        <div className="profile-banner" style={{ position: "relative", zIndex: 1 }}>
          <div className="profile-banner-glow" style={{ zIndex: -1 }} />
        </div>

        {/* ── PROFILE CARD ── */}
        <div className="profile-card" style={{ position: "relative", zIndex: 2 }}>
          <div
            className="profile-avatar-ring"
            onClick={() => profilePic && setShowAvatarModal(true)}
            style={{ position: "relative", zIndex: 3, cursor: profilePic ? "pointer" : "default" }}
          >
            {profilePic ? (
              <img src={profilePic} alt={profileUsername} className="profile-avatar" />
            ) : (
              <div className="profile-avatar-fallback">
                {profileUsername?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>

          <h1 className="profile-username">@{profileUsername}</h1>

          <div className="profile-stats-row">
            <div className="profile-stat-box">
              <span className="profile-stat-number">{posts.length}</span>
              <span className="profile-stat-label">Posts</span>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat-box">
              <span className="profile-stat-number">{followers}</span>
              <span className="profile-stat-label">Followers</span>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat-box">
              <span className="profile-stat-number">{following}</span>
              <span className="profile-stat-label">Following</span>
            </div>
          </div>
        </div>

        {/* ── POSTS ── */}
        <div className="profile-posts-section">
          <div className="profile-posts-header">
            <FiGrid size={16} />
            <span className="profile-posts-title">Posts</span>
            <button
              onClick={() => navigate("/create-post")}
              style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}
            >
              <FiPlus size={14} /> Create Post
            </button>
          </div>

          {loading ? (
            <div className="profile-posts-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="profile-skeleton-card" />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="profile-posts-grid">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="profile-post-tile"
                  onClick={() => navigate(`/${post._id}`)}
                >
                  <img src={post.uri} alt={post.caption} />
                  <div className="profile-post-overlay">
                    <p className="profile-post-caption">{post.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="profile-empty-state">
              <span className="profile-empty-icon">📷</span>
              <p className="profile-empty-title">No posts yet</p>
              <p className="profile-empty-subtitle">Share your first moment with the world.</p>
              <button onClick={() => navigate("/create-post")} style={{ marginTop: 20 }}>
                + Create Post
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ── AVATAR LIGHTBOX ── */}
      {showAvatarModal && (
        <div
          onClick={() => setShowAvatarModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            cursor: "zoom-out"
          }}
        >
          <img
            src={profilePic}
            alt={profileUsername}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(400px, 80vw)",
              height: "min(400px, 80vw)",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 0 60px rgba(0,0,0,0.6)",
              cursor: "default"
            }}
          />
        </div>
      )}
    </>
  )
}

export default CurrProfile
