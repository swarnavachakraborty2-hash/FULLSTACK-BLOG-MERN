import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"



const Feed = () => {

    const navigate = useNavigate()
    const [posts, setPosts] = useState([])

    useEffect(() => {

        axios.get("http://localhost:5000/api/user/posts", {
            withCredentials: true
        })
            .then((res) => {

                setPosts(res.data.posts)

            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/logout", {}, {
                withCredentials: true
            })

            navigate("/")

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className='feed-section'>
            <div className="feed-header">
                <h1>Feed</h1>

                <div className="feed-actions">
                    <button onClick={() => navigate("/create-post")}>
                        + Create
                    </button>

                    <button onClick={() => navigate("/my-feed")}>
                        My Posts
                    </button>

                    <button onClick={() => navigate("/")}>
                        Register
                    </button>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="grid">
                {posts.length > 0 ? (
                    posts.map((post) => (

                        <div
                            key={post._id}
                            className='post-card'
                            onClick={() => navigate(`/feed/${post._id}`)}
                            style={{ position: "relative" }}
                        >
                            <img
                                src={post.uri}
                                alt={post.caption}
                            />

                            <p>{post.caption}</p>

                        </div>
                    ))
                ) : (
                    <h2 style={{ textAlign: "center", width: "100%" }}>
                        No posts available
                    </h2>
                )}
            </div>
        </section>
    )
}

export default Feed