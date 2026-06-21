import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Register() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post(
                "http://localhost:5000/api/auth/register",
                { username, email, password },
                { withCredentials: true }
            ).then((res) => {
                console.log(res.data)
                navigate("/")
            })
        } catch (error) {
            console.log(error)
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

                <p className="auth-switch">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")}>Sign in</span>
                </p>
            </div>
        </section>
    )
}

export default Register
