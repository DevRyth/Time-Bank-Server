import { Request, Response } from "express";
import { Document, Error } from "mongoose";
import { RoleInterface } from "../schema-interface/role.interface";
import { UserInterface } from "../schema-interface/user.interface";

const User = require("../model/user.model");
const Role = require("../model/role.model");
const TimeBank = require("../model/timebank.model");

const { getRoles } = require("../helper/helper");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async (req: Request, res: Response) => {
  const { username, email } = req.body;
  const password = bcrypt.hashSync(req.body.password, 10);

  const tb = new TimeBank();
  const timebank = await tb.save();
  const time_bank = timebank._id;

  const newUser = new User({ username, email, password, time_bank });
  await newUser.save().then(async (user: UserInterface) => {
    if (req.body.roles) {
      await Role.find({ name: { $in: req.body.roles } }).then(async (roles: RoleInterface[]) => {
        // if (err) return res.status(500).send({ message: err });

        user.roles = roles.map((role: RoleInterface) => role._id);
        await user.save().then().catch((err: Error) => {
          return res.status(401).json({ message: "Cannot save user" });
        });
      }).catch((err: Error) => {
        console.log("Error ", err);
      });
    } else return res.status(401).json({ message: "Roles not defined!!" });
  }).catch((err: Error) => {
    if (err) {
      console.log("Error: ", err);
      return res.status(500).json({ error: err });
    }
  });

  const savedUser = await User.findOne({ username: username }).populate("user_info").populate("time_bank").populate({
    path: "courses", populate: {
      path: "schedule.appointment",
      model: "Appointment"
    }
  });

  const jwtToken = jwt.sign({ roles: savedUser.roles, id: savedUser._id }, process.env.SECRET_TOKEN, { expiresIn: process.env.TOKEN_EXPIRY });

  if (savedUser) return res.json({ user: savedUser, token: jwtToken });
  return res.status(401).json({ message: "Cannot save user" });
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const userWithUsername = await User.findOne({ username: username }).populate("roles", "-__v").catch(
    (err: Error) => {
      console.log("Error: ", err);
    }
  );

  if (!userWithUsername)
    return res
      .status(400)
      .json({ message: "Username or password does not match!" });

  const isPasswordValid = bcrypt.compareSync(req.body.password, userWithUsername.password);

  if (!isPasswordValid) return res.status(400).json({ message: "Username or password does not match!" });

  const jwtToken = jwt.sign({ roles: userWithUsername.roles, id: userWithUsername._id }, process.env.SECRET_TOKEN, { expiresIn: process.env.TOKEN_EXPIRY });

  res.json({ user: userWithUsername, token: jwtToken });
};

const me = async (req: Request, res: Response) => {
  await User.findOne({ _id: req.user_id }).populate("user_info").populate("time_bank").populate({
    path: "courses", populate: {
      path: "schedule.appointment",
      model: "Appointment"
    }
  }).then((user: UserInterface) => {
    return res.status(200).json(user);
  });
};

export { }

module.exports = { signup, login, me };