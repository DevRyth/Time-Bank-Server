import { Request, Response } from "express";
import { Error } from "mongoose";
import { UserInterface } from "../schema-interface/user.interface";
import { UserInfoInterface } from "../schema-interface/userinfo.interface";

const User = require('../model/user.model');
const UserInfo = require('../model/userInfo.model');

export const register = async (req: Request, res: Response) => {

    const userinfo = req.body;

    const existingUser = await User.findOne({ _id: req.user_id }).catch((err: Error) => {
        return res.status(404).json("Invalid Token!!");
    });

    if (existingUser.user_info) return res.status(200).json(existingUser);

    const userInfo = new UserInfo(userinfo);

    const savedUserInfo = await userInfo.save(async (err: Error, u: UserInfoInterface) => {
        if (err) return res.status(500).json({ error: "Cannot save user info at the moment!", err });
        existingUser.user_info = u._id;
        await existingUser.save();
        const savedUser = await User.findOne({ _id: req.user_id }).populate(["user_info", "time_bank"]).then((u: UserInterface) => {
            return res.status(200).json(u);
        })
    });

};
