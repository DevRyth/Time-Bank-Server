const express = require("express");
const Course = require("../model/course");
const User = require("../model/user");
const Appointment = require("../model/appointment");

const router = express.Router();

router.post("/course", async (req, res) => {

    const wholetoken = req.headers.authorization;
    const token = wholetoken.slice(0, wholetoken.length / 2);

    const user = await User.findOne({ id: token });
    if (!user) {
        return res.status(409).json({ message: "Token Invalid" });
    }

    const c = req.body;
    for (let i = 0; i < c.schedule.length; i++) {
        const d = c.schedule[i].appointment;
        const existAppointment = await Appointment.findOne({ start: d.start, duration: d.duration, day: d.day });
        if (!existAppointment) {
            const appointment = new Appointment(d);
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

    const newCourse = new Course(c);
    console.log(newCourse);
    await newCourse.save((err, course) => {
        if(err) res.status(400).json(err);
        console.log(course);
        user.courses.push(course.course_id);
        user.save();
        return res.status(200).json(user);
    });
});

module.exports = router;