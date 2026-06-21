const express = require("express")
const multer = require('multer')
const route = express.Router()
const authControllers = require("../controllers/auth.controller")

const upload = multer({ storage: multer.memoryStorage() })

route.post("/register", upload.single("image"), authControllers.Register)// req = {image:"",username:"",email:"",password:""}

route.post("/login", authControllers.Login)// req = {username:""/email:"" , password:""}

route.post("/logout", authControllers.Logout)



module.exports = route