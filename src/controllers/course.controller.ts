import { Request, Response } from "express";
import { Error } from "mongoose";

const Course = require("../model/course.model");
const User = require("../model/user.model");
const Appointment = require("../model/appointment.model");

const courseRegister = async (req: Request, res: Response) => {

    const authToken = req.headers.authorization;
    const token = authToken!.slice(0, authToken!.length / 2);

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
            }).catch((err: Error) => {
                return res.status(400).send(err);
            });
        }
        else {
            c.schedule[i].appointment = existAppointment._id;
        }
    }

    const newCourse = new Course({ ...c, creator: user._id });
    await newCourse.save(async (err: Error, course: any) => {
        if (err) res.status(400).json(err);
        user.courses.push(course._id);
        await user.save();
        await User.findOne({ _id: user }).populate({
            path: "courses", populate: {
                path: "schedule.appointment",
                model: "Appointment"
            }
        }).then((u: any) => {
            return res.status(200).json({ courses: u.courses, creator_id: u.user_id });
        });
    });
};

const getMyCourses = async (req: Request, res: Response) => {
    const authToken = req.headers.authorization;
    const token = authToken!.slice(0, authToken!.length / 2);

    const user = await User.findOne({ _id: token }).catch((err: Error) => {
        return res.status(404).json("Invalid Token!!");
    });

    await Course.find({ user_id: user.user_id }, (err: Error, courses: any) => {
        if (err) return res.status(404).json(err);
        return res.status(200).json(courses);
    })

};

const getAllCourses = async (req: Request, res: Response) => {
    const offset = req.query.offset ? req.query.offset as string : "1";
    const limit = req.query.limit ? req.query.limit as string : "20";

    await Course.find({}).populate({
        path: "creator", select: "email username user_id user_info", populate: {
            path: "user_info",
            model: "UserInfo",
        }
    }).populate("schedule.appointment").then((courses: any) => {
        const start = parseInt(limit) * (parseInt(offset) - 1);
        const end = parseInt(limit) * (parseInt(offset) - 1) + parseInt(limit);
        return res.status(200).json(courses.slice(start, end));
    })
};

const searchCourse = async (req: Request, res: Response) => {
    const search_query = req.query.search_query;
    const offset = req.query.offset ? req.query.offset as string : "1";
    const limit = req.query.limit ? req.query.limit as string : "20";

    await Course.find({ "title": { "$regex": search_query, "$options": "i" } }).populate({
        path: "creator", select: "email username user_id user_info", populate: {
            path: "user_info",
            model: "UserInfo",
        }
    }).populate("schedule.appointment").then((courses: any) => {
        const start = parseInt(limit) * (parseInt(offset) - 1);
        const end = (parseInt(limit) * (parseInt(offset) - 1)) + parseInt(limit);
        return res.status(200).json(courses.slice(start, end));
    }).catch((err: Error) => {
        res.status(400).json(err);
    });
};

const getAllCourseByInstructor = async (req: Request, res: Response) => {
    const userId = req.query.user_id;

    console.log(userId);

    await User.findOne({ user_id: userId }).then(async (user: any) => {
        await Course.find({ creator: user._id }).populate("schedule.appointment").then((courses: any) => {
            return res.status(200).json(courses);
        })
    }).catch((err: Error) => {
        return res.status(404).json(err);
    });
};

const getCourseById = async (req: Request, res: Response) => {
    const courseId = req.query.course_id;

    await Course.findOne({ course_id: courseId }).populate({
        path: "creator", populate: {
            path: "user_info",
            model: "UserInfo"
        }
    }).populate("schedule.appointment").then((course: any) => {
        return res.status(200).json(course);
    });
};

const enrollCourse = async (req: Request, res: Response) => {
    if (!req.headers.authorization) return res.status(404).json("Invalid Token");
    const token = req.headers.authorization.slice(0, req.headers.authorization.length / 2);

    const user = await User.findOne({ _id: token });
    if (!user) return res.status(404).json("Invalid token");

    const course_id = req.body.course_id;
    const appointment_id = req.body.appointment_id;

    const course = await Course.findOne({ course_id: course_id }).populate('schedule.appointment');

    for (let i = 0; i < course.schedule.length; i++) {
        if (course.schedule[i].appointment.appointment_id == appointment_id) {
            if (course.schedule[i].isEnrolled == true) return res.status(403).json("Course already enrolled");
            course.schedule[i].isEnrolled = true;
        }
    }

    user.enrolled.push({ course: course, appointment_id: appointment_id });

    await user.save();
    await course.save();

    res.status(200).json({ course_id: course_id, appointment_id: appointment_id });
};

const getEnrolledCoursesByUser = async (req: Request, res: Response) => {
    if (!req.headers.authorization) return res.status(404).json("Invalid Token");
    const token = req.headers.authorization.slice(0, req.headers.authorization.length / 2);

    const user = await User.findOne({ _id: token }).populate({
        path: "enrolled.course", populate: [{
            path: "schedule.appointment"
        }, {
            path: "creator",
            select: "email username user_info user_id",
            populate: {
                path: "user_info",
                select: "first_name middle_name last_name"
            }
        }]
    });
    if (!user) return res.status(404).json("Invalid token");

    return res.status(200).json(user.enrolled);
};

const deleteCourse = async (req: Request, res: Response) => {
    if (!req.headers.authorization) return res.status(404).json("Invalid token");
    const token = req.headers.authorization.slice(0, req.headers.authorization.length / 2);

    const user = await User.findOne({ _id: token });
    if (!user) return res.status(404).json("Invalid token");

    const course_id = req.query.course_id;

    const course = await Course.findOne({ course_id: course_id }).populate('creator');

    if (course.creator.user_id !== user.user_id)
        return res.status(403).json("You are not authorize to delete this course");

    const courseObjectId = course._id;

    const enrolledUsers = await User.find({ "enrolled.course": courseObjectId }).populate('enrolled.course');

    for (let i = 0; i < enrolledUsers.length; i++) {
        for (let j = 0; j < enrolledUsers[i].enrolled.length; j++) {
            if (enrolledUsers[i].enrolled[j].course._id.toString() === courseObjectId.toString()) {
                enrolledUsers[i].enrolled.splice(j, 1);
                j--;
            }
        }
        await enrolledUsers[i].save();
    }

    await Course.findOneAndDelete({ course_id: course_id }).catch((err: Error) => {
        return res.status(401).json({ message: "Unable to delete", err });
    });

    user.courses.splice(user.courses.indexOf(courseObjectId), 1);

    await user.save();

    return res.status(200).json(enrolledUsers);
};

export { }

module.exports = { courseRegister, getMyCourses, getAllCourses, searchCourse, getAllCourseByInstructor, getCourseById, enrollCourse, getEnrolledCoursesByUser, deleteCourse };