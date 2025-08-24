const express=require("express")

const {Signup, Login, Logout} = require("../controllers/user.contollers")



const userRoute=express.Router()



userRoute.post("/signup",Signup)

userRoute.post("/login",Login)

userRoute.get("/logout",Logout)




module.exports=userRoute
