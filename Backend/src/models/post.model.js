const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    //image will be converted to url using cloud storage provider will be stored in DB as a string
    uri: {
        type: String,
        required: true
    },


    caption: {
        type: String,
        required: true
    },


    //contains the ids of the user who liked the post
    likes: [{
        //_id is added automatically to each like
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],


    //contains the ids and comments of the users
    comments: [{
        //_id is added automatically to each comment
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        comment: {
            type: String
        }
    }],


    //contains the ids of the user who created the post
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
})

const postModel = mongoose.model("post", postSchema)//"post" = name of the collection that will be stored in DB

module.exports = postModel