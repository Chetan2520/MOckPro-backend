const express=require("express");
const mongoose=require("mongoose");
const router=express.Router();
const Interview = require('../models/inteviewModel');


router.get('/items', async (req, res) => {
    const items = await Interview.find().sort({ createdAt: -1 }).limit(1);
    res.json(items[0]);
    
  });

 
  module.exports=router;
