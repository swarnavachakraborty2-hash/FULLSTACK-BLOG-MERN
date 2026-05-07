const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    uri: {
        type: String,
        required: true
    }, //image will be converted to url using cloud storage provider will be stored in DB as a string
    caption: {
        type: String,
        required: true
    },
    //contains the ids of the user who liked the post
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
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