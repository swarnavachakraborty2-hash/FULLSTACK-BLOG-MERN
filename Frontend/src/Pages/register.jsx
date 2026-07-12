import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from "react-router-dom"

function Register() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const res = await api.post("/api/auth/register", { username, email, password })
            const newUserId = res.data.user._id
            navigate(`/uploadProfile/${newUserId}`)
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || "Couldn't create your account. Try again.")
        }
    }


    return (
        <section className="auth-section">
            <div className="auth-card">
                <div className="auth-logo">Pixora</div>
                <h1>Create Account</h1>

                <form onSubmit={handleSubmit}>
                    <label>
                        Username
                        <input
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="yourhandle"
                            required
                        />
                    </label>

                    <label>
                        Email
                        <input
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </label>

                    <button type="submit">Create Account</button>
                </form>

                {error && <p className="auth-hint is-error">{error}</p>}

                <p className="auth-switch">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")}>Sign in</span>
                </p>
            </div>
        </section>
    )
}

export default Register