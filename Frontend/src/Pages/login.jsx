import React, { useState } from 'react'
import axios from "axios"
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
            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    username,
                    email,
                    password
                },
                { withCredentials: true }
            )

            console.log(res.data)
            navigate("/feed")

        } catch (error) {
            console.log(error)
            alert("Login failed")
        }
    }

    return (
        <section className="auth-section">
            <div className="auth-card">
                <h1>Log in to your Account</h1>
                <p className="auth-hint">
                    Use either username or email to login
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        name='username'
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='enter your username (or use email)'
                    />

                    <input
                        name='email'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='enter your email (or use username)'
                    />

                    <input
                        name='password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='enter your password'
                        required
                    />

                    <button type="submit">Login</button>
                </form>
                <p className="auth-switch">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/")}>Register</span>
                </p>
            </div>
        </section>
    )
}

export default Login