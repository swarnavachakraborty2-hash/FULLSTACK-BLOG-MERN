import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Comments() {

    const [comments, setComments] = useState([])
    const [comment, setComment] = useState("")
    const [userID, setUserID] = useState()
    const [username, setUsername] = useState()
    const { id } = useParams()
    const navigate = useNavigate()


    useEffect(() => {
        const fetchuser = async () => {
            await axios.get("http://localhost:5000/api/user/get-userid", { withCredentials: true })
                .then((res) => {
                    setUserID(res.data.id)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        fetchuser()
    }, [id])

    useEffect(() => {
        const fetchuser = async () => {
            await axios.get("http://localhost:5000/api/user/get-user", { withCredentials: true })
                .then((res) => {
                    setUsername(res.data.user.username)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        fetchuser()
    }, [id])

    // fetch comments on page load
    useEffect(() => {
        const fetchComments = async () => {
            await axios.get(`http://localhost:5000/api/user/posts/${id}`, { withCredentials: true })
                .then((res) => {
                    setComments(res.data.comments)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        fetchComments()
    }, [userID, id, comment, comments])


    const handleDelete = async (index) => {
        await axios.delete(`http://localhost:5000/api/user/posts/${id}/comment`, {
            data: { index: index },
            withCredentials: true
        })
            .then((res) => {
                setComments(res.data.comments)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleComment = async () => {
        await axios.post(`http://localhost:5000/api/user/posts/${id}/comment`, { comment }, { withCredentials: true })
            .then((res) => {
                console.log(res.data.message)
                setComment("")
            })
    }


    return (
        <section className="comments-section">

            {/* 🔹 HEADER */}
            <div className="comments-header">
                <button onClick={() => navigate(-1)}>Back</button>
                <h2>Comments</h2>
            </div>

            <div className="comments-list">
                {comments.length > 0 ? (
                    comments.map((c, index) => (
                        <div key={index} className="comment-wrapper">

                            {
                                (c.id.username == username) ? <span className="comment-username">
                                    you
                                </span> :
                                    <span className="comment-username">
                                        {c.id.username}
                                    </span>
                            }


                            <div className="comment-card">
                                <p>{c.comment}</p>
                                {
                                    (c.id._id == userID) &&
                                    <button onClick={() => { handleDelete(index) }} className="delete-btn">
                                        Delete
                                    </button>
                                }
                            </div>

                        </div>
                    ))
                ) : (
                    <h3 style={{ textAlign: "center", color: "#aaa" }}>
                        No comments yet
                    </h3>
                )}
            </div>
            <div
                style={{
                    position: "fixed",
                    bottom: "0",
                    left: "0",
                    width: "100%",
                    background: "#1e1e2f",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    zIndex: 1000
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

        </section>
    )
}

export default Comments