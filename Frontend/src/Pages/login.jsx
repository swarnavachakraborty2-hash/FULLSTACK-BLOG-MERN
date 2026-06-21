import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from "react-router-dom"

function Login() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!username && !email) {
            alert("Enter either username or email")
            return
        }
        try {
            const res = await api.post(
                "/api/auth/login",
                { username, email, password }
            )
            console.log(res.data)
            navigate("/")
        } catch (error) {
            console.log(error)
            alert("Login failed")
        }
    }


    return (
        <section className="auth-section">
            <div className="auth-card">
                <div className="auth-logo">Pixora</div>
                <h1>Welcome back</h1>

                <p className="auth-hint">Use username or email to sign in</p>

                <form onSubmit={handleSubmit}>
                    <label>
                        Username
                        <input
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="yourhandle (or use email)"
                        />
                    </label>

                    <label>
                        Email
                        <input
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com (or use username)"
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

                    <button type="submit">Sign In</button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/register")}>Register</span>
                </p>
            </div>
        </section>
    )
}

export default Login
