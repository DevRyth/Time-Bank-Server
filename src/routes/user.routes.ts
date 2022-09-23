const express = require('express');

const { register } = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post('/register', verifyToken, register);

export { };

module.exports = router;