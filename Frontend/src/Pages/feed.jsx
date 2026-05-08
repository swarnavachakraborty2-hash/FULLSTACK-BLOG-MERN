import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { FiSearch } from "react-icons/fi";
import axios from "axios"



const Feed = () => {

    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [searchCaption, setSearchCaption] = useState("")


    //fetching posts based on search bar
    useEffect(() => {

        const fetchPosts = async () => {
            try {
                if (searchCaption.trim() === "") {
                    const res = await axios.get(
                        "http://localhost:5000/api/user/posts",
                        { withCredentials: true }
                    )
                    setPosts(res.data.posts)
                }
                else {
                    const res = await axios.post(
                        "http://localhost:5000/api/user/search-post",
                        { search: searchCaption },
                        { withCredentials: true }
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

                <div className="feed-right">
                    <form className="search-bar">
                        <input type="text" name='searchCaption' value={searchCaption} onChange={(e) => setSearchCaption(e.target.value)} placeholder="Search posts..." />
                    </form>

                    <div className="feed-actions">
                        <button onClick={() => navigate("/create-post")}>+ Create</button>
                        <button onClick={() => navigate("/my-feed")}>My Posts</button>
                        <button onClick={() => navigate("/")}>Register</button>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid">
                {posts && posts.length > 0 ? (
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