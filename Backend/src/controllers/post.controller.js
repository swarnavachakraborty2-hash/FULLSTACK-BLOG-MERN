const postModel = require('../models/post.model')
const authModel = require("../models/auth.model")
const uploadFile = require("../services/imagekit")
const jwt = require("jsonwebtoken")



async function createPost(req, res) {

    const caption = req.body.caption

    const result = await uploadFile(req.file.buffer)//will return an object with url inside it 

    const post = await postModel.create({
        uri: result.url,
        caption: caption,
        user_id: req.user.id //creating every post with user's id 
    })

    return res.status(201).json({
        message: "Post created successfully",
        post
    })

}


async function getPosts(req, res) {

    if (req.user) {
        const posts = await postModel.find().populate("user_id", "username").limit(30)

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts
        })
    }
    else {
        return res.status(401).json({
            message: "cant get posts"
        })
    }

}


async function deletePost(req, res) {

    const id = req.params.id

    const post = await postModel.findById(id)

    if (req.user.id == post.user_id.toString()) {//finding the post based on params id and checking if the user id from decoded matches with the user_id in postmodel because every post created by an user has their id
        await postModel.findOneAndDelete({
            _id: id
        })

        return res.status(200).json({
            message: "Post deleted successfully",
        })
    }
    else {
        return res.status(403).json({
            message: "you can't delete others posts",
        })
    }

}



async function updatePosts(req, res) {//needs to pass a paramter object with key = {"caption":"value"}.

    const id = req.params.id

    const post = await postModel.findById(id)

    if (req.user.id == post.user_id.toString()) {
        await postModel.findOneAndUpdate({
            _id: id
        }, {
            caption: req.body.caption
        })

        return res.status(200).json({
            message: "Post updated successfully",
        })
    }
    else {
        return res.status(403).json({
            message: "you can't update others posts"
        })
    }

}



async function getPost(req, res) {

    const id = req.params.id
    const post = await postModel.findById(id)

    const userid = req.user.id

    let isOwner = false
    if (userid == post.user_id.toString()) {
        isOwner = true
    }

    return res.status(200).json({
        message: "post found",
        post,
        isOwner
    })

}



async function getUserPosts(req, res) {

    const userPosts = await postModel.find({
        user_id: req.user.id
    }).limit(20)

    return res.status(200).json({
        message: "user posts fetched successfully",
        userPosts
    })
}


async function searchPost(req, res) {

    if (req.user) {
        const { searchTitle } = req.body

        const post = await postModel.find({
            title: searchTitle
        })

        if (!post) {
            return res.status(200).json({ message: "no posts found" })
        }

        return res.status(200).json({
            message: "post found",
            post
        })
    }
    else {
        return res.status(404).json({
            message: "error"
        })
    }
}


async function likePost(req, res) {

    const user_id = req.user.id

    const post_id = req.params.id

    const post = await postModel.findOne({_id: post_id})

    const alreadyLiked = post.likes.includes(user_id)

    if(alreadyLiked){
         post.likes.pull(user_id)// modified the array but still didn't use direct database query language so it is not saved in the database yet

         await post.save()// save the changes to database

         return res.status(200).json({
            message: "post unliked successfully",
            likes: post.likes.length,
            liked: false
         })
    }

    post.likes.push(user_id)

    await post.save()

    return res.status(200).json({
        message: "post liked successfully",
        likes: post.likes.length,
        liked: true
    })
}


module.exports = { createPost, getPost, getPosts, deletePost, updatePosts, getUserPosts, searchPost, likePost }