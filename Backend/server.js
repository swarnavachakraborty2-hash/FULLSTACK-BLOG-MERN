require("dotenv").config() //using this we can access env variables from child directories

const app = require('./src/index')

const connectDB = require('./src/DB/db')



const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})



connectDB()




