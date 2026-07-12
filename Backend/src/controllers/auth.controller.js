const authModel = require("../models/auth.model")
const jwt = require("jsonwebtoken")
const uploadFile = require("../services/imagekit")
const bcrypt = require("bcrypt")

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
}



async function Register(req, res) {

    const { username, email, password } = req.body


    const userAlreadyExists = await authModel.findOne({
        email
    })
    if (userAlreadyExists) {
        return res.status(409).json({
            message: "email already in use"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)//generate a fixed size hash of password


    //storing userdata in db
    const user = await authModel.create({
        username,
        password: hashedPassword,//storing the hashed password
        email
    })


    //creating token and storing it in user's browser so token will be sent with every request from the user's browser to check identy
    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET_KEY)

    res.cookie("token", token, cookieOptions)



    res.status(201).json({
        message: "user registered successfully",
        user
    })

}

async function Login(req, res) {

    const { username, email, password } = req.body

    const user = await authModel.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    if (!user) {
        return res.status(401).json({ message: "user not registered" })
    }

    const passwordVerified = await bcrypt.compare(password, user.password)

    if (!passwordVerified) {
        return res.status(401).json({ message: "invalid password" })
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET_KEY)

    res.cookie("token", token, cookieOptions)

    return res.status(200).json({
        message: "user logged in successfully",
        user
    })

}

async function uploadProfile(req, res) {

    try {
        const id = req.params.id

        if (req.user.id.toString() == id) {

            const user = await authModel.findOne({
                _id: id
            })

            if (!user) {
                return res.status(404).json({
                    message: "user not found"
                })
            }

            if (req.file) {      //multer
                if (req.file) {
                    const result = await uploadFile(req.file.buffer)
                    user.uri = result.url 
                    await user.save()
                }
            }

            return res.status(200).json({
                message: "profile picture added",
                user
            })
        }
        else {
            return res.status(404).json({
                message: "unauthorised"
            })
        }
    }
    catch {
        return res.status(404).json({
            message: "something went wrong"
        })
    }

}

async function Logout(req, res) {
    res.clearCookie("token", cookieOptions)
    res.status(200).json({
        message: "logged out successfully"
    })
}


async function Follow(req, res) {
    const userID = req.user.id
    const id = req.params.id

    const user = await authModel.findOne({ _id: id })//user to follow
    const currUser = await authModel.findOne({ _id: userID })//user who follows


    const followed = user.followers.includes(userID)

    if (!followed) {

        user.followers.push(userID)

        currUser.following.push(id)

        await user.save()
        await currUser.save()

        return res.status(200).json({ message: "followed successfully" })
    }

    user.followers.pull(userID)
    currUser.following.pull(id)
    await user.save()
    await currUser.save()
    return res.status(200).json({ message: "unfollowed successfully" })

}




module.exports = { Register, uploadProfile, Login, Logout, Follow }