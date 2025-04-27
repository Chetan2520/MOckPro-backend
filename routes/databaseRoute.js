const express=require("express");
const mongoose=require("mongoose");
const router=express.Router();
const Interview = require('../models/inteviewModel');


router.get('/items', async (req, res) => {
    const items = await Interview.find();
    res.json(items);
  });


  module.exports=router;
