const express = require("express");

const { checkIfUserExists, checkRolesExists } = require('../middlewares/auth.middleware');
const { signup, login, me } = require('../controllers/auth.controller');

const router = express.Router();

router.post("/signup", checkIfUserExists, checkRolesExists, signup);
router.post("/login", login);
router.get("/me", me);


module.exports = router;