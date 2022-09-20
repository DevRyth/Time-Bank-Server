const express = require("express");
const User = require("../model/user");
const UserInfo = require("../model/userInfo");
const TimeBank = require("../model/timebank");
const { getRoles } = require("../helper/helper");

const jwt = require("jsonwebtoken");

const router = express.Router();

const checkRolesExisted = (req, res, next) => {
  const roles = getRoles();
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!roles.includes(req.body.roles[i])) {
        return res.status(400).send({ message: `Role ${req.body.roles[i]} does not exist!` });
      }
    }
  }

  next();
};

router.post("/signup", checkRolesExisted, async (req, res) => {
  const { username, email, password } = req.body;

  const alreadyExistUserWithEmail = await User.findOne({ email: email }).catch(
    (err) => {
      console.log("Error: ", err);
    }
  );

  if (alreadyExistUserWithEmail) {
    return res.status(409).json({ message: "User with email already exists!" });
  }

  const alreadyExistUserWithUsername = await User.findOne({ username: username }).catch(
    (err) => {
      console.log("Error: ", err);
    }
  )

  if (alreadyExistUserWithUsername) {
    return res.status(409).json({ message: "User with username already exists!" });
  }

  const tb = new TimeBank();
  const timebank = await tb.save();
  const time_bank = timebank._id;

  const newUser = new User({ username, email, password, time_bank });
  const savedUser = await newUser.save().catch((err) => {
    console.log("Error: ", err);
    res.status(500).json({ error: err });
  });

  const jwtToken = jwt.sign({ id: savedUser.id, username: savedUser.username }, process.env.SECRET_TOKEN, { expiresIn: process.env.TOKEN_EXPIRY });

  const u = await User.findOne({ username: username }).populate("user_info").populate("time_bank").populate({
    path: "courses", populate: {
      path: "schedule.appointment",
      model: "Appointment"
    }
  });

  if (savedUser) res.json({ user: u, token: jwtToken });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const userWithUsername = await User.findOne({ username: username }).catch(
    (err) => {
      console.log("Error: ", err);
    }
  );

  if (!userWithUsername)
    return res
      .status(400)
      .json({ message: "Username or password does not match!" });

  if (userWithUsername.password !== password)
    return res
      .status(400)
      .json({ message: "Username or password does not match!" });

  const jwtToken = jwt.sign({ id: userWithUsername.id, username: userWithUsername.username }, process.env.SECRET_TOKEN, { expiresIn: process.env.TOKEN_EXPIRY });

  res.json({ user: userWithUsername, token: jwtToken });
});

router.get("/me", async (req, res) => {
  const token = req.headers.authorization.slice(0, req.headers.authorization.length / 2);
  // const user = await User.findOne({id: token}, async (err, me) => {
  //   if(err) return res.status(404).json("Invalid token!!");
  //   const userInfo = await UserInfo.findOne({userinfo_id: me.user_info}, (err, userInfo) => {
  //     if(err) return res.status(404).json(err);
  //     return res.status(200).json({user: me, userInfo: userInfo});
  //   })
  // });
  const u = await User.findOne({ _id: token }).populate("user_info").populate("time_bank").populate({
    path: "courses", populate: {
      path: "schedule.appointment",
      model: "Appointment"
    }
  }).then((user) => {
    return res.status(200).json(user);
  });
});


module.exports = router;