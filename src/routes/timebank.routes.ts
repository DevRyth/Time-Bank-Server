const express = require('express');

const { getTimeBankByUser } = require("../controllers/timebank.controller");

const router = express.Router();

router.get("/timebank", getTimeBankByUser);

export { };

module.exports = router;