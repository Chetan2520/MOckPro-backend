const express=require("express");

const router=express.Router();

router.get("/",(req,res)=>{
    res.send("working");
    console.log("working...");
})


module.exports=router;
