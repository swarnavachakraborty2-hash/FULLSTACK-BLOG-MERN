const mongoose = require("mongoose")

const authSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    uri: {
        type: String
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ]
})

const authModel = mongoose.model("user", authSchema)

module.exports = authModel