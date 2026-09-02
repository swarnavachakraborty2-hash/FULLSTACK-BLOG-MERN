const express = require("express")
const multer = require('multer')
const route = express.Router()
const authControllers = require("../controllers/auth.controller")
const authMiddlewares = require("../middlewares/auth.middleware")

const upload = multer({ storage: multer.memoryStorage() })

route.post("/register", authControllers.Register)// req = {image:"",username:"",email:"",password:""}

route.post("/uploadProfile/:id", authMiddlewares.authGeneral, upload.single("image"), authControllers.uploadProfile)

route.patch("/updateProfile/:id", authMiddlewares.authGeneral, upload.single("image"), authControllers.UpdateProfile)
route.patch("/updateProfile", authMiddlewares.authGeneral, upload.single("image"), authControllers.UpdateProfile)

route.post("/login", authControllers.Login)// req = {username:""/email:"" , password:""}

route.post("/logout", authControllers.Logout)



module.exports = route