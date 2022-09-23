const express = require("express");

const { checkIfUserExists, checkRolesExists, verifyToken } = require('../middlewares/auth.middleware');
const { signup, login, me } = require('../controllers/auth.controller');

const router = express.Router();

router.post("/signup", checkIfUserExists, checkRolesExists, signup);
router.post("/login", login);
router.get("/me", verifyToken, me);


export { };


module.exports = router;