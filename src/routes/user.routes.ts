import { register } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth/auth.middleware";

const express = require('express');

const router = express.Router();

router.post('/register', verifyToken, register);

export { };

module.exports = router;