import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { FiArrowLeft } from 'react-icons/fi'

/* ── SVG Icons ── */
const HeartFilled = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 21.593c-.425-.396-8.057-7.496-8.057-12.065 0-3.584 2.916-6.528 6.53-6.528 1.715 0 3.35.68 4.527 1.876C16.172 3.745 17.808 3 19.527 3c3.614 0 6.53 2.944 6.53 6.528 0 4.569-7.631 11.669-8.057 12.065l-3 .001z"/>
    </svg>
)

const HeartOutline = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
)

const CommentIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="comment-svg">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
)

const SendIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
)

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

    useEffect(() => {
        axios.get("http://localhost:5000/api/user/get-userid", { withCredentials: true })
            .then((res) => setUserID(res.data.id))
    }, [id])

    useEffect(() => {
        const fetchpost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/user/posts/${id}`, { withCredentials: true })
                setImg(res.data.image)
                setCaption(res.data.caption)
                setIsOwner(res.data.isOwner)
                setLikes(res.data.likes.length)
                setComments(res.data.comments.length)
                if (res.data.likes.includes(userID)) setLiked(true)
            } catch (error) {
                console.log(error)
            }
        }
        fetchpost()
    }, [id, userID])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.patch(`http://localhost:5000/api/user/posts/${id}`, { caption }, { withCredentials: true })
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    const deletePost = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/user/posts/${id}`, { withCredentials: true })
            navigate("/")
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
            .catch((err) => console.log(err))
    }

    const handleComment = async () => {
        await axios.post(`http://localhost:5000/api/user/posts/${id}/comment`, { comment }, { withCredentials: true })
            .then((res) => {
                console.log(res.data.message)
                setComment("")
                navigate(`/${id}/comments`)
            })
    }

    return (
        <div className="edit-container">
            {/* Back button */}
            <button
                className="btn-ghost"
                onClick={() => navigate(-1)}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
                <FiArrowLeft /> Back
            </button>

            <form onSubmit={handleSubmit} className="edit-form">

                {/* Header row */}
                <div className="post-meta-header">
                    <span className="post-meta-title">
                        {isOwner ? "Edit Post" : "View Post"}
                    </span>

                    <div className="post-actions-row">
                        {/* Like */}
                        <button
                            type="button"
                            className="like-btn"
                            onClick={handleLike}
                            aria-label="Like"
                        >
                            <span
                                className="like-icon"
                                style={{ color: liked ? "#f43f5e" : "#64748b" }}
                            >
                                {liked ? <HeartFilled /> : <HeartOutline />}
                            </span>
                            <span className="like-count">{likes}</span>
                        </button>

                        {/* Comments */}
                        <div
                            className="comment-icon-btn"
                            onClick={() => navigate(`/${id}/comments`)}
                        >
                            <CommentIcon />
                            <span className="comment-count">{comments}</span>
                        </div>
                    </div>
                </div>

                {/* Image */}
                <img src={img} alt={caption} />

                {/* Caption */}
                {isOwner ? (
                    <input
                        type="text"
                        name="caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Edit caption…"
                    />
                ) : (
                    <h4>{caption}</h4>
                )}

                {/* Owner actions */}
                {isOwner && (
                    <div className="btn-group">
                        <button type="submit">Update Post</button>
                        <button type="button" className="delete" onClick={deletePost}>
                            Delete
                        </button>
                    </div>
                )}

                {/* Inline comment */}
                <div className="inline-comment-bar">
                    <div className="inline-comment-inner">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment…"
                        />
                        <button type="button" className="send-btn" onClick={handleComment}>
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Postcard
