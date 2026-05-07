const jwt  = require("jsonwebtoken")

async function authGeneral(req,res,next) {

    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message:"unauthorised"
        })
    }

    try {
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)

        req.user = decoded

        next()

    } catch (error) {

        console.log(error)

        return res.status(401).json({message:"invalid token!"})
        
    }
}

module.exports = {authGeneral}