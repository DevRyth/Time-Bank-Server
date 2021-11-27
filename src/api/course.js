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
            const newDuration = await appointment.save().then(() => {
                c.schedule[i].appointment = appointment._id;
            }).catch(err => {
                return res.status(400).send(err);
            });
        }
        else {
            c.schedule[i].appointment = existAppointment._id;
        }
    }

    const newCourse = new Course({...c, creator: user._id});
    await newCourse.save(async (err, course) => {
        if(err) res.status(400).json(err);
        user.courses.push(course._id);
        await user.save();
        await User.findOne({_id: user}).populate({path: "courses", populate: {
            path: "schedule.appointment",
            model: "Appointment"
        }}).then((u) => {
            return res.status(200).json({courses: u.courses, creator_id: u.user_id});
        });
    });
});

router.get("/my-course", async (req, res) => {
    const authToken = req.headers.authorization;
    const token = authToken.slice(0, authToken.length / 2);
    
    const user = await User.findOne({_id: token}).catch((err) => {
        return res.status(404).json("Invalid Token!!");
    });

    await Course.find({user_id: user.user_id}, (err, courses) => {
        if(err) return res.status(404).json(err);
        return res.status(200).json(courses);
    })

});

router.get("/all-courses", async (req, res) => {
    const offset = req.query.offset ? req.query.offset : 1;
    const limit = req.query.limit ? req.query.limit : 20;

    await Course.find({}).populate({path: "creator", select: "email username user_id user_info", populate: {
        path: "user_info",
        model: "UserInfo",
    }}).populate("schedule.appointment").then((courses) => {
        const start = limit * (offset - 1);
        const end = parseInt(limit * (offset - 1)) + parseInt(limit);
        return res.status(200).json(courses.slice(start, end));
    })
});

router.get("/creator-course", async (req, res) => {
    const userId = req.query.user_id;

    console.log(userId);

    await User.findOne({user_id: userId}).then(async (user) => {
        await Course.find({creator: user._id}).populate("schedule.appointment").then((courses) => {
            return res.status(200).json(courses);
        })
    }).catch((err) => {
        return res.status(404).json(err);
    });
});

router.get("/course", async (req, res) => {
    const courseId = req.query.course_id;

    await Course.findOne({course_id: courseId}).populate({path: "creator", populate: {
        path: "user_info",
        model: "UserInfo"
    }}).populate("schedule.appointment").then((course) => {
        return res.status(200).json(course);
    });
});

module.exports = router;