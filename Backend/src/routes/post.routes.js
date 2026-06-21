const express = require("express")
const route = express.Router()
const multer = require('multer')
const postControllers = require("../controllers/post.controller")
const authControllers = require("../controllers/auth.controller")
const authMiddlewares = require("../middlewares/auth.middleware")


//middleware to store uploaded image to ram
const upload = multer({ storage: multer.memoryStorage() })//this middleware can read files(ex: images) and store them in the memory temporarily.



//general user actions
//upload post
route.post('/create-post', authMiddlewares.authGeneral, upload.single("image"), postControllers.createPost)// req = {image: file,caption: string}

//get current user's posts
route.get('/user-posts', authMiddlewares.authGeneral, postControllers.getMyPosts)

//get all posts
route.get("/posts", postControllers.getPosts)

//get a searched post
route.post("/search-post",  postControllers.searchPost)// req = {searchTitle: string}

//get a selected post (postcard)
route.get("/posts/:id", authMiddlewares.authGeneral, postControllers.getPost)



//post modification actions
//delete post
route.delete("/posts/:id", authMiddlewares.authGeneral, postControllers.deletePost)

//update post
route.patch("/posts/:id", authMiddlewares.authGeneral, postControllers.updatePosts)

//like/unlike post
route.post("/posts/:id/like", authMiddlewares.authGeneral, postControllers.likePost)

//comment on post
route.post("/posts/:id/comment", authMiddlewares.authGeneral, postControllers.commentPost)
//delete comment
route.delete("/posts/:id/comment", authMiddlewares.authGeneral, postControllers.deleteComment)



//validation
//return current user's id in string format (for like status)
route.get("/get-userid", authMiddlewares.authGeneral, postControllers.getUserID)

//return current user's all details
route.get("/get-user", authMiddlewares.authGeneral, postControllers.getCurrentUser)



//operations on other users

//return all users
route.get("/profiles", postControllers.getUsers)

//return all users based on search 
route.post("/search-profiles", authMiddlewares.authGeneral, postControllers.searchUser)

//return a user's profile
route.get("/profiles/:id",authMiddlewares.authGeneral, postControllers.getUserProfile)


//return current user profile
route.post("/user-profile", authMiddlewares.authGeneral, postControllers.getUserProfile)


//following/unfollowing other users
route.post("/profiles/:id/follow",authMiddlewares.authGeneral, authControllers.Follow)

//get a user's posts
route.get("/profiles/:id/posts",authMiddlewares.authGeneral, postControllers.getUserPosts)



module.exports = route