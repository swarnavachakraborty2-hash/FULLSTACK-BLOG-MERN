const express = require('express')
const cors = require("cors")
const PostRoutes = require("./routes/post.routes")
const AuthRoutes = require("./routes/auth.routes")
const cookieParse = require("cookie-parser")

const app = express()



//middlewares
app.use(express.json())//using this method(middleware) express can read text data in json format
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))
// using this, webpage of one origin(ex:port 5173) can request services from another origin(port:5000) with cookies (credentials: true) i.e; cancels cors policy
app.use(cookieParse())//middleware to store tokens in cookie storage in client browser



//auth routes
app.use("/api/auth",AuthRoutes)
//post routes
app.use("/api/user",PostRoutes)


module.exports = app