import { Request, Response } from "express";
import { Error } from "mongoose";

const express = require('express');
const User = require('../model/user.model');
const TimeBank = require('../model/timebank.model');

const router = express.Router();

const getTimeBankByUser = async (req: Request, res: Response) => {
    const authToken = req.headers.authorization;
    const token = authToken!.slice(0, authToken!.length / 2);

    const existingUser = await User.findOne({ _id: token }).catch((err: Error) => {
        return res.status(404).json("Invalid Token!!");
    });

    const timebank = await TimeBank.findOne({ timebank_id: existingUser.time_bank }).catch((err: Error) => {
        return res.status(404).json("Time bank doesn't exist");
    });

    res.status(200).json(timebank);
};

export { }

module.exports = { getTimeBankByUser };