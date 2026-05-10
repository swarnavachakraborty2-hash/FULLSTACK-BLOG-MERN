const express = require("express")
const route = express.Router()
const multer = require('multer')
const postControllers = require("../controllers/post.controller")
const authMiddlewares = require("../middlewares/auth.middleware")


//middleware to store uploaded image to ram
const upload = multer({ storage: multer.memoryStorage() })//this middleware can read files(ex: images) and store them in the memory temporarily.



//general user actions
//upload post
route.post('/create-post', authMiddlewares.authGeneral, upload.single("image"), postControllers.createPost)// req = {image: file,caption: string}

//get user's posts
route.get('/user-posts', authMiddlewares.authGeneral, postControllers.getUserPosts)

//get all posts
route.get("/posts", authMiddlewares.authGeneral, postControllers.getPosts)

//get a searched post
route.post("/search-post", authMiddlewares.authGeneral, postControllers.searchPost)// req = {searchTitle: string}

//get a selected post
route.get("/posts/:id", authMiddlewares.authGeneral, postControllers.getPost)



//post modification actions
//delete post
route.delete("/posts/:id", authMiddlewares.authGeneral, postControllers.deletePost)

//update post
route.patch("/posts/:id", authMiddlewares.authGeneral, postControllers.updatePosts)

//like post
route.post("/posts/:id/like", authMiddlewares.authGeneral, postControllers.likePost)

//comment on post
route.post("/posts/:id/comment", authMiddlewares.authGeneral, postControllers.commentPost)
//delete comment
route.delete("/posts/:id/comment", authMiddlewares.authGeneral, postControllers.deleteComment)




//validation
//return current user's id in string format
route.get("/get-userid", authMiddlewares.authGeneral, postControllers.getUserID)

//return current user's all details
route.get("/get-user", authMiddlewares.authGeneral, postControllers.getUser)


module.exports = route