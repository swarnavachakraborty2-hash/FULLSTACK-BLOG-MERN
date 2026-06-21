import React, { useState, useRef } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { FiUploadCloud } from 'react-icons/fi'

const CreatePost = () => {
    const [preview, setPreview] = useState(null)
    const [fileName, setFileName] = useState("")
    const fileRef = useRef()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        await axios.post("http://localhost:5000/api/user/create-post", formData, { withCredentials: true })
            .then((res) => {
                console.log(res.data)
                navigate("//my-profile")
            })
            .catch((err) => {
                console.log(err)
                alert("Error creating post")
            })
    }

    const handleFile = (e) => {
        const file = e.target.files[0]
        if (file) {
            setPreview(URL.createObjectURL(file))
            setFileName(file.name)
        }
    }

    return (
        <section className="create-post-section">
            <h1>New Post</h1>

            <form onSubmit={handleSubmit} className="form">

             
                <div
                    className="file-input-wrapper"
                    onClick={() => fileRef.current.click()}
                >
                    {preview ? (
                        <img src={preview} className="preview" alt="Preview" />
                    ) : (
                        <>
                            <span className="file-icon"><FiUploadCloud size={36} /></span>
                            <p style={{ fontWeight: 600, marginBottom: 4 }}>Click to upload image</p>
                            <p style={{ fontSize: 12 }}>PNG, JPG, WEBP supported</p>
                        </>
                    )}
                    <input
                        ref={fileRef}
                        type="file"
                        name="image"
                        accept="image/*"
                        required
                        onChange={handleFile}
                        style={{ display: "none" }}
                    />
                </div>

                {fileName && (
                    <p style={{ fontSize: 12, color: "#6c8bff", textAlign: "center", marginTop: -6 }}>
                        📎 {fileName}
                    </p>
                )}

                <input
                    type="text"
                    name="caption"
                    placeholder="Write a caption…"
                    required
                />

                <button type="submit">Publish Post</button>
            </form>

            <button className="secondary" onClick={() => navigate(-1)}>
                ← Back 
            </button>
        </section>
    )
}

export default CreatePost
