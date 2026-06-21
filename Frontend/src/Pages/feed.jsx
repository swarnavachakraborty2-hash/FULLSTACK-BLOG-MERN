import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { FiSearch, FiPlus, FiGrid, FiLogOut, FiUserPlus } from "react-icons/fi"
import api from "../api/axios"

const Feed = () => {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [searchCaption, setSearchCaption] = useState("")
    const [username, setUsername] = useState("")
    const [profilePic, setProfilePic] = useState("")
    const [presentUser, setPresentUser] = useState(false)

    //fetching current user details if logged in
    useEffect(() => {
        api.get("/api/user/get-user")
            .then((res) => {
                if (res.data._id) {
                    setPresentUser(true)
                    setUsername(res.data.username)
                    setProfilePic(res.data.uri)
                }
                else {
                    setPresentUser(false)
                }
            }
            ).catch(() => setPresentUser(false))
    }, [presentUser])

    //fetching everyone's post based on search
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (searchCaption.trim() === "") {
                    const res = await api.get("/api/user/posts")
                    setPosts(res.data.posts)
                } else {
                    const res = await api.post(
                        "/api/user/search-post",
                        { search: searchCaption }
                    )
                    setPosts(res.data.posts)
                }
            } catch (err) {
                console.log(err)
            }
        }
        const delay = setTimeout(fetchPosts, 400)
        return () => clearTimeout(delay)
    }, [searchCaption])

    useEffect(()=>{},[])


    
    const handleLogout = async () => {
        try {
            await api.post("/api/auth/logout", {})
            setPresentUser(false)
            setUsername("")
            setProfilePic("")
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

                {/* Search */}
                <div className="search-bar">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        value={searchCaption}
                        onChange={(e) => setSearchCaption(e.target.value)}
                        placeholder="Search posts…"
                    />
                </div>

                {/* Right actions */}
                <div className="navbar-right">
                    <button onClick={() => presentUser ? navigate("/create-post") : navigate("/login")} title="Create Post">
                        <FiPlus style={{ marginRight: 6, verticalAlign: "middle" }} />
                        Create
                    </button>



                    <button className="btn-ghost" onClick={() => navigate("/register")} title="Register">
                        <FiUserPlus style={{ verticalAlign: "middle" }} />
                    </button>

                    {username && (
                        <span
                        onClick={()=>navigate("/my-profile")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontFamily: "'Clash Display', sans-serif",
                            fontSize: 13,
                            color: "#6c8bff",
                            fontWeight: 600,
                            padding: "6px 10px",
                            background: "rgba(108,139,255,.1)",
                            borderRadius: 8,
                            border: "1px solid rgba(108,139,255,.2)",
                            cursor: "pointer"
                        }}>
                            <div style={{
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #6c8bff, #a78bfa)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "white",
                                flexShrink: 0,
                                overflow: "hidden"
                            }}>
                                {profilePic
                                    ? <img src={profilePic} alt={username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    : username?.[0]?.toUpperCase()
                                }
                            </div>
                            @{username}
                        </span>
                    )}

                   { presentUser && <button className="logout-btn" onClick={handleLogout}>
                        <FiLogOut style={{ verticalAlign: "middle" }} />
                    </button>}
                </div>
            </nav>

            {/* ── FEED ── */}
            <section className="feed-section">
                <h1 className="feed-page-title">Discover</h1>

                <div className="grid">
                    {posts && posts.length > 0 ? (
                        posts.map((post) => (
                            <div
                                key={post._id}
                                className="post-card"
                                onClick={() =>  presentUser ? navigate(`/${post._id}`) : navigate("/login")}
                            >
                                <img src={post.uri} alt={post.caption} />
                                <div className="post-card-body">
                                    <p className="post-card-author" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{
                                            width: 22,
                                            height: 22,
                                            borderRadius: "50%",
                                            background: "linear-gradient(135deg, #6c8bff, #a78bfa)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: "white",
                                            flexShrink: 0,
                                            overflow: "hidden"
                                        }}>
                                            {post.user_id.uri
                                                ? <img src={post.user_id.uri} alt={post.user_id.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                : post.user_id.username?.[0]?.toUpperCase()
                                            }
                                        </span>
                                        @{post.user_id.username}
                                    </p>
                                    <p className="post-card-caption">{post.caption}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <span className="empty-state-icon">🖼️</span>
                            <h2>No posts yet</h2>
                            <p>Be the first to share something beautiful.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default Feed
