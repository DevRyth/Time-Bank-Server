import { login, me, signup } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth/auth.middleware";
import { validateLoginSchema } from "../middlewares/auth/login.middleware";
import { checkIfUserExists, checkRolesExists, validateSignupSchema } from "../middlewares/auth/signup.middleware";

const express = require("express");


const router = express.Router();

router.post("/signup", validateSignupSchema, checkIfUserExists, checkRolesExists, signup);
router.post("/login", validateLoginSchema, login);
router.get("/me", verifyToken, me);


export { };


module.exports = router;