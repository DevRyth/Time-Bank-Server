const User = require("../model/user.model");
const TimeBank = require("../model/timebank.model");

const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

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
};

const login = async (req, res) => {
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
};

const me = async (req, res) => {
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
};


module.exports = { signup, login, me };