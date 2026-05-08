const express = require("express")
const route = express.Router()
const authControllers = require("../controllers/auth.controller")


route.post("/register", authControllers.Register)// req = {username:"",email:"",password:""}

route.post("/login", authControllers.Login)// req = {username:""/email:"" , password:""}

route.post("/logout", authControllers.Logout)



module.exports = route