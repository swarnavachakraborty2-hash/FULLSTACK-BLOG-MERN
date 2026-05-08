import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function Postcard() {
    const [img, setImg] = useState()
    const [caption, setCaption] = useState("")
    const [isOwner, setIsOwner] = useState(false)
    const [likes, setLikes] = useState(0)
    const [liked, setLiked] = useState()
    const [userID, setUserID] = useState()
    const { id } = useParams()
    const navigate = useNavigate()


    //fetch user details on page load
    useEffect(() => {
        const fetchuser = async () => {
            await axios.get("http://localhost:5000/api/user/get-user",{withCredentials: true})
                .then((res) => {
                    setUserID(res.data.id)
                })
        }
        fetchuser()
    }, [id])


    //fetch post on page load
    useEffect(() => {
        const fetchpost = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/user/posts/${id}`,
                    { withCredentials: true }
                )

                setImg(res.data.image)
                setCaption(res.data.caption)
                setIsOwner(res.data.isOwner)
                setLikes(res.data.likes.length)
                if (res.data.likes.includes(userID)) {
                    setLiked(true)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchpost()
    }, [id,userID])


    //update
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await axios.patch(
                `http://localhost:5000/api/user/posts/${id}`,
                { caption },
                { withCredentials: true }
            )

            navigate("/feed")

        } catch (error) {
            console.log(error)
        }
    }


    //delete
    const deletePost = async () => {
        try {
            await axios.delete(
                `http://localhost:5000/api/user/posts/${id}`,
                { withCredentials: true }
            )

            navigate("/feed")

        } catch (error) {
            console.log(error)
        }
    }



    const handleLike = async () => {
        await axios.post(`http://localhost:5000/api/user/posts/${id}/like`, {}, { withCredentials: true })
            .then((res) => {
                setLikes(res.data.likes)
                setLiked(res.data.liked)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className="edit-container ">
            <button onClick={() => navigate("/feed")}>Back</button>
            <form onSubmit={handleSubmit} className="edit-form">


                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        borderBottom: "2px solid #979494",
                        paddingBottom: "8px"
                    }}
                >
                    <h2
                        style={{
                            fontSize: "26px",
                            fontWeight: "600",
                            color: "#b6b4b4",
                            letterSpacing: "0.5px",
                            margin: 0
                        }}
                    >
                        {isOwner ? "Edit Post :" : "View Post :"}
                    </h2>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >
                        <button
                            type="button"
                            onClick={handleLike}
                            style={{
                                background: "transparent",
                                border: "none",
                                fontSize: "28px",
                                cursor: "pointer",
                                transition: "0.2s",
                                color: liked ? "#ff4d4d" : "#bbb"
                            }}
                        >
                            {liked ? "❤️" : "🤍"}
                        </button>

                        <span
                            style={{
                                color: "#ccc",
                                fontSize: "15px",
                                fontWeight: "500"
                            }}
                        >
                            {likes}
                        </span>
                    </div>
                </div>

                <img src={img} alt="" />

                {isOwner ? <input
                    type="text"
                    name="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Edit caption"

                /> : <h4>{caption}</h4>
                }


                {isOwner && (
                    <div className="btn-group">
                        <button type="submit">Update</button>
                        <button
                            type="button"
                            className="delete"
                            onClick={deletePost}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default Postcard