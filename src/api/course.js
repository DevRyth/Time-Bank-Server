const express = require("express");
const Course= require("../model/course");
const User = require("../model/user");

const router = express.Router();

router.post("/course",async(req,res)=>{
    const wholetoken =req.headers.authorization;
    const token= wholetoken.slice(0,wholetoken.length/2);

    const user = await User.findOne({id:token});
    if(!user)
    {
        return res.status(409).json({message:"Token Invalid"});
    }

    const course= req.data;
    const newCourse = new Course(course);
    await newCourse.save().then(item =>{
        res.status(200).json(course);
    }).catch(err => {
        res.status(400).send("unable to save to database");
    });
})