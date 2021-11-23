const express = require("express");
const User = require("../model/user");
const UserInfo = require("../model/userInfo");
// const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const alreadyExistsUser = await User.findOne({email: email}).catch(
    (err) => {
      console.log("Error: ", err);
    }
  );

  if (alreadyExistsUser) {
    return res.status(409).json({ message: "User with email already exists!" });
  }

  const newUser = new User({ username, email, password });
  const savedUser = await newUser.save().catch((err) => {
    console.log("Error: ", err);
    res.status(500).json({ error: "Cannot register user at the moment!" });
  });

  const user = await User.findOne({email: email});

  if (savedUser) res.json({email: email, username: username, token: user.id + user.id});
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userWithEmail = await User.findOne({email: email}).catch(
    (err) => {
      console.log("Error: ", err);
    }
  );

  if (!userWithEmail)
    return res
      .status(400)
      .json({ message: "Email or password does not match!" });

  if (userWithEmail.password !== password)
    return res
      .status(400)
      .json({ message: "Email or password does not match!" });


  // const jwtToken = jwt.sign(
  //   { id: userWithEmail.id, email: userWithEmail.email },
  //   process.env.JWT_SECRET
  // );

  // console.log(jwtToken);

  res.json({ userWithEmail, token: userWithEmail.id + userWithEmail.id });
});

router.get("/me", async (req, res) =>{
  const token=req.headers.authorization.slice(0, req.headers.authorization.length / 2);
  const user = await User.findOne({id: token}, async (err, me) => {
    if(err) return res.status(404).json("Invalid token!!");
    const userInfo = await UserInfo.findOne({userinfo_id: me.user_info}, (err, userInfo) => {
      if(err) return res.status(404).json(err);
      return res.status(200).json({me: me, userInfo: userInfo});
    })
  });
});


module.exports = router;