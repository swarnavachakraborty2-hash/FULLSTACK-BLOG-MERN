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


    const posts = await postModel.find().populate("user_id", "username uri").limit(30)

    return res.status(200).json({
        message: "Posts fetched successfully",
        posts
    })


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


// returns the selected post and also return the ownership of the post if it is owned by the user or not and likes in a string format
async function getPost(req, res) {

    const id = req.params.id
    const post = await postModel.findById(id).populate("comments.id", "username")

    const userid = req.user.id

    let isOwner = false
    if (userid == post.user_id.toString()) {
        isOwner = true
    }

    return res.status(200).json({
        user_id: post.user_id.toString(),
        message: "post found",
        image: post.uri,
        caption: post.caption,
        likes: post.likes.map((like) => like.toString()),//return array of liked users in a string format tom store in useState frontend
        isOwner, //checks ownership of the post
        comments: post.comments
    })

}



async function getMyPosts(req, res) {

    const userPosts = await postModel.find({
        user_id: req.user.id
    }).limit(20)

    return res.status(200).json({
        message: "user posts fetched successfully",
        userPosts
    })
}



async function searchPost(req, res) {
    try {
        const { search } = req.body

        const posts = await postModel.find({
            caption: search
        })

        return res.status(200).json({
            message: "posts found",
            posts
        })

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            message: "server error"
        })
    }
}



async function likePost(req, res) {

    const user_id = req.user.id

    const post_id = req.params.id

    const post = await postModel.findOne({ _id: post_id })

    const alreadyLiked = post.likes.includes(user_id)

    if (alreadyLiked) {
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



async function commentPost(req, res) {

    const id = req.user.id
    const postID = req.params.id

    const { comment } = req.body

    const post = await postModel.findOne({
        _id: postID
    })

    post.comments.push({ id, comment })

    await post.save()

    return res.status(200).json({
        message: "comment uploaded successfully",
        comments: post.comments
    })

}



async function deleteComment(req, res) {

    const id = req.user.id
    const postID = req.params.id
    const { index } = req.body //provide the index of the comment to be deleted 

    const post = await postModel.findOne({ _id: postID })

    //find the comment{} based on provided index of the comment
    const foundComment = post.comments[index]

    //checks ownership
    if (foundComment.id.toString() == id) {

        post.comments.splice(index, 1) //delete the comment from the comments array whose index was provided 
        await post.save()

        return res.status(200).json({
            message: "comment deleted successfully",
            comments: post.comments
        })
    }

    return res.status(200).json({
        message: "can't delete comment",
        comments: post.comments
    })

}



async function getUserID(req, res) {

    const userID = req.user.id

    const user = await authModel.findOne({ _id: userID })

    if (userID) {
        return res.status(200).json({
            message: "user fetched successfully",
            id: user._id.toString()
        })
    }
    return res.status(200).json({
        message: "user not logged in"
    })

}



async function getCurrentUser(req, res) {

    if (req.user.id) {//check if user is logged in or not 

        const userID = req.user.id
        const user = await authModel.findOne({ _id: userID })

        if (userID) {
            return res.status(200).json({
                message: "user fetched successfully",
                _id: user._id.toString(),
                username: user.username,
                uri: user.uri,
                followers: user.followers.map((follower) => follower.toString()),
                following: user.following.map((user) => user.toString())
            })
        }
    }
    else {
        return res.status(200).json({
            message: "user not logged in"
        })
    }
}



async function getUsers(req, res) {


    const users = await authModel.find()

    if (users) {
        return res.status(200).json({
            message: "users fetched successfully",
            users
        })
    } else {
        return res.status(200).json({
            message: "no users found"
        })
    }
}


async function searchUser(req, res) {

    const {search} = req.body


    const foundUser = await authModel.find({
        username: search
    })

    return res.status(200).json({
        message:"user fetched successfully",
        foundUser
    })


}


async function getUserProfile(req, res) {

    const currUser = req.user.id
    const userID = req.params.id

    const user = await authModel.findOne({ _id: userID })

    if (user) {
        return res.status(200).json({
            message: "user fetched successfully",
             user: {                                        
                _id: user._id.toString(),
                username: user.username,
                uri: user.uri,
                followers: user.followers.map((f) => f.toString()),
                following: user.following.map((f) => f.toString())
            }
        })
    }
    return res.status(200).json({
        message: "user not found"
    })

}


async function getUserPosts(req, res) {

    const userID = req.params.id


    const posts = await postModel.find({ user_id: userID })

    return res.status(200).json({
        message: "user's posts fetched successfully",
        posts
    })

}

module.exports = { createPost, getPost, getPosts, deletePost, updatePosts, getMyPosts, searchPost, likePost, getUserID, getCurrentUser, commentPost, deleteComment, getUsers, getUserProfile, getUserPosts, searchUser }