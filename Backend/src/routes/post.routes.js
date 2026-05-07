const express = require("express")
const route = express.Router()
const multer = require('multer')
const postControllers = require("../controllers/post.controller")
const authMiddlewares = require("../middlewares/auth.middleware")


//middleware to store uploaded image to ram
const upload = multer({ storage: multer.memoryStorage() })//this middleware can read files(ex: images) and store them in the memory temporarily.



route.post('/create-post', authMiddlewares.authGeneral, upload.single("image"), postControllers.createPost)// req = {image: file,caption: string}

route.get('/user-posts', authMiddlewares.authGeneral, postControllers.getUserPosts)

route.get("/posts", authMiddlewares.authGeneral, postControllers.getPosts)

route.get("/search-post", authMiddlewares.authGeneral, postControllers.searchPost)// req = {searchTitle: string}



route.delete("/posts/:id", authMiddlewares.authGeneral, postControllers.deletePost)
route.patch("/posts/:id", authMiddlewares.authGeneral, postControllers.updatePosts)
route.get("/posts/:id", authMiddlewares.authGeneral, postControllers.getPost)
route.post("/posts/:id/like", authMiddlewares.authGeneral, postControllers.likePost)




module.exports = route