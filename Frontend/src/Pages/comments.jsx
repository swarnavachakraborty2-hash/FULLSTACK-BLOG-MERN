import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

const SendIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
)

function Comments() {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState("")
    const [userID, setUserID] = useState()
    const [username, setUsername] = useState()
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        axios.get("http://localhost:5000/api/user/get-userid", { withCredentials: true })
            .then((res) => setUserID(res.data.id))
            .catch((err) => console.log(err))
    }, [id])

    useEffect(() => {
        axios.get("http://localhost:5000/api/user/get-user", { withCredentials: true })
            .then((res) => setUsername(res.data.user.username))
            .catch((err) => console.log(err))
    }, [id])

    useEffect(() => {
        axios.get(`http://localhost:5000/api/user/posts/${id}`, { withCredentials: true })
            .then((res) => setComments(res.data.comments))
            .catch((err) => console.log(err))
    }, [userID, id, comment])

    const handleDelete = async (index) => {
        await axios.delete(`http://localhost:5000/api/user/posts/${id}/comment`, {
            data: { index },
            withCredentials: true
        })
            .then((res) => setComments(res.data.comments))
            .catch((err) => console.log(err))
    }

    const handleComment = async () => {
        if (!comment.trim()) return
        await axios.post(
            `http://localhost:5000/api/user/posts/${id}/comment`,
            { comment },
            { withCredentials: true }
        ).then((res) => {
            console.log(res.data.message)
            setComment("")
        })
    }

    const handleKey = (e) => {
        if (e.key === "Enter") handleComment()
    }

    return (
        <>
            <section className="comments-section">
                {/* Header */}
                <div className="comments-header">
                    <button
                        className="btn-ghost"
                        onClick={() => navigate(-1)}
                        style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                        <FiArrowLeft /> Back
                    </button>
                    <h2>Comments</h2>
                    <span style={{
                        marginLeft: "auto",
                        fontSize: 12,
                        color: "#6c8bff",
                        fontWeight: 700,
                        background: "rgba(108,139,255,.1)",
                        border: "1px solid rgba(108,139,255,.2)",
                        borderRadius: 8,
                        padding: "4px 10px"
                    }}>
                        {comments.length}
                    </span>
                </div>

                {/* Comment list */}
                <div className="comments-list">
                    {comments.length > 0 ? (
                        comments.map((c, index) => (
                            <div key={index} className="comment-wrapper">
                                <span className="comment-username">
                                    {c.id.username === username ? "you" : `@${c.id.username}`}
                                </span>
                                <div className="comment-card">
                                    <p>{c.comment}</p>
                                    {c.id._id === userID && (
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(index)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <span className="empty-state-icon">💬</span>
                            <h2>No comments yet</h2>
                            <p>Start the conversation below.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Sticky comment bar */}
            <div className="comment-input-bar">
                <div className="comment-input-inner">
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="Write a comment…"
                    />
                    <button
                        type="button"
                        className="send-btn"
                        onClick={handleComment}
                        style={{ right: 6, top: "50%", transform: "translateY(-50%)", position: "absolute" }}
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </>
    )
}

export default Comments
