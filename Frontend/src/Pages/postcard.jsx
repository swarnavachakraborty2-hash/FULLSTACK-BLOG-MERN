import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function Postcard() {
    const [img, setImg] = useState()
    const [caption, setCaption] = useState("")
    const [isOwner, setIsOwner] = useState(false)
    const [likes, setLikes] = useState(0)
    const [liked, setLiked] = useState(false)
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState(0)
    const [userID, setUserID] = useState()
    const { id } = useParams()
    const navigate = useNavigate()


    //fetch user details on page load
    useEffect(() => {
        const fetchuser = async () => {
            await axios.get("http://localhost:5000/api/user/get-userid", { withCredentials: true })
                .then((res) => {
                    setUserID(res.data.id)
                })
        }
        fetchuser()
    }, [id])


    //fetch post after user details
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
                setComments(res.data.comments.length)
                if (res.data.likes.includes(userID)) {
                    setLiked(true)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchpost()
    }, [id, userID])


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


    //like
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


    //comment
    const handleComment = async () => {
        await axios.post(`http://localhost:5000/api/user/posts/${id}/comment`, { comment }, { withCredentials: true })
            .then((res) => {
                console.log(res.data.message)
                setComment("")
                navigate(`/feed/${id}/comments`)
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
                            gap: "16px"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1px"
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleLike}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    fontSize: "26px",
                                    cursor: "pointer",
                                    color: liked ? "#ff4d4d" : "#bbb",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                {liked ? "❤️" : "🤍"}


                                <span
                                    style={{
                                        color: "#ccc",
                                        fontSize: "14px",
                                        fontWeight: "500"
                                    }}
                                >
                                    {likes}
                                </span>
                            </button>
                        </div>
                        <div
                            onClick={() => { navigate(`/feed/${id}/comments`) }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                            }}
                        >
                            <img
                                src="https://cdn.iconscout.com/icon/free/png-256/comment-3251596-2724645.png"
                                alt="comment"

                                style={{
                                    width: "22px",
                                    height: "22px",
                                    objectFit: "contain",
                                    filter: "invert(80%)"
                                }}
                            />

                            <span
                                style={{
                                    color: "#ccc",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}
                            >
                                {comments}
                            </span>
                        </div>
                    </div>
                </div>

                <img src={img} alt="" />

                {isOwner ? <input
                    type="text"
                    name="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Edit caption"

                /> : <h4 style={{ alignContent: "center" }}>{caption}</h4>
                }

                <div
                    style={{
                        marginTop: "10px",
                        position: "relative",
                        marginTop: "15px",
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            width: "260px"
                        }}
                    >
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            style={{
                                width: "100%",
                                height: "40px",
                                padding: "0 45px 0 12px",
                                fontSize: "13px",
                                borderRadius: "20px",
                                border: "1px solid #555",
                                background: "#1e1e2f",
                                color: "#fff",
                                outline: "none"
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleComment}
                            style={{
                                position: "absolute",
                                right: "5px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                height: "30px",
                                width: "30px",
                                borderRadius: "50%",
                                border: "none",
                                background: "#ff4d4d",
                                color: "white",
                                cursor: "pointer",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>


                {isOwner && (
                    <div className="btn-group" style={{ position: "relative", zIndex: 10 }}>
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