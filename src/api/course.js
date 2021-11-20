const express = require("express");

const User = require("../model/user");

const router = express.Router();

router.post("/course",async(req,res)=>{
    const wholetoken =req.headers.authorization;
    const token= wholetoken.slice(0,wholetoken.length/2);

    const user = await User.findOne({id:token});
    if(!user){
        return res.status(409).json({message:"Token Invalid"});
    }
    
})