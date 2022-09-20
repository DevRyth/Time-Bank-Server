const express = require('express');

const { courseRegister, getMyCourses, getAllCourses, searchCourse, getAllCourseByInstructor, getCourseById, enrollCourse, getEnrolledCoursesByUser, deleteCourse } = require("../controllers/course.controller");

const router = express.Router();

router.post("/course-register", courseRegister);
router.get("/my-course", getMyCourses);
router.get("/all-courses", getAllCourses);
router.get("/search-course", searchCourse);
router.get("/creator-course", getAllCourseByInstructor);
router.get("/course", getCourseById);
router.post("/enroll-course", enrollCourse);
router.get("/my-enroll", getEnrolledCoursesByUser);
router.delete("/delete-course", deleteCourse);

module.exports = router;