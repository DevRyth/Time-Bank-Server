const express = require("express");
const Course= require("../model/course");
const User = require("../model/user");
const Appointment = require("../model/appointment");


const router = express.Router();

 router.post("/course",async(req,res)=>{

    const wholetoken =req.headers.authorization;
    const token= wholetoken.slice(0,wholetoken.length/2);

    const user = await User.findOne({id:token});
    if(!user)
    {
        return res.status(409).json({message:"Token Invalid"});
    }

    const course= req.body;
    for (let i = 0; i < course.schedule.length; i++){
        const d = course.schedule[i].appointment;
        const existAppointment = await Appointment.findOne({start:d.start,duration:d.duration,day:d.day});
        if(!existAppointment)
        {
            const appointment = new Appointment(d);
            const newDuration =  await appointment.save().then(() => {
                course.schedule[i].appointment = appointment._id;
            }).catch(err => {
                return res.status(400).send(err);
            });
        }
        else {
            course.schedule[i].appointment = existAppointment._id;
        }
    }
    const newCourse = new Course(course);
    await newCourse.save().then(item =>{
      return  res.status(200).json(course);
    }).catch(err => {
      return  res.status(400).send(err);
    });
})

module.exports =router;