const express = require("express");
const Course = require("../model/course");
const User = require("../model/user");
const Appointment = require("../model/appointment");

const router = express.Router();

router.post("/course-register", async (req, res) => {

    const authToken = req.headers.authorization;
    const token = authToken.slice(0, authToken.length / 2);

    const user = await User.findOne({ _id: token });
    if (!user) {
        return res.status(409).json({ message: "Token Invalid" });
    }

    const c = req.body;
    for (let i = 0; i < c.schedule.length; i++) {
        const d = c.schedule[i].appointment;
        const existAppointment = await Appointment.findOne({ start: d.start, duration: d.duration, day: d.day });
        if (!existAppointment) {
            const appointment = new Appointment(d);
            console.log(appointment);
            const newDuration = await appointment.save().then(() => {
                c.schedule[i].appointmentId = appointment.appointment_id;
            }).catch(err => {
                return res.status(400).send(err);
            });
        }
        else {
            c.schedule[i].appointmentId = existAppointment.appointment_id;
        }
    }

    const newCourse = new Course({...c, user_id: user.user_id});
    await newCourse.save((err, course) => {
        if(err) res.status(400).json(err);
        // console.log(course);
        user.courses.push(course.course_id);
        user.save();
        return res.status(200).json(user);
    });
});

router.get("/my-course", async (req, res) => {
    const authToken = req.headers.authorization;
    const token = authToken.slice(0, authToken.length / 2);
    
    const user = await User.findOne({_id: token}).catch((err) => {
        return res.status(404).json("Invalid Token!!");
    });

    const myCourses = await Course.find({user_id: user.user_id}, (err, courses) => {
        if(err) return res.status(404).json(err);
        return res.status(200).json(courses);
    })

});

router.get("/creator-course", async (req, res) => {
    const userId = req.query.user_id;

    const user = await User.findOne({user_id: userId}).catch((err) => {
        return res.status(404).json("Invalid Token!!");
    });
    
    const userCourses = await Course.find({user_id: user.user_id}, (err, courses) => {
        if(err) return res.status(404).json(err);
        return res.status(200).json(courses);
    })

})

module.exports = router;