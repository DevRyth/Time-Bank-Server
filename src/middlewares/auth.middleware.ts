import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";

const User = require("../model/user.model");
const jwt = require("jsonwebtoken");

const { getRoles } = require("../helper/helper");

const checkIfUserExists = async (req: Request, res: Response, next: NextFunction) => {

    const { username, email } = req.body;

    const alreadyExistUserWithEmail = await User.findOne({ email: email }).catch(
        (err: Error) => {
            console.log("Error: ", err);
        }
    );

    if (alreadyExistUserWithEmail) {
        return res.status(409).json({ message: "User with email already exists!" });
    }

    const alreadyExistUserWithUsername = await User.findOne({ username: username }).catch(
        (err: Error) => {
            console.log("Error: ", err);
        }
    )

    if (alreadyExistUserWithUsername) {
        return res.status(409).json({ message: "User with username already exists!" });
    }

    next();
}

const checkRolesExists = (req: Request, res: Response, next: NextFunction) => {
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


const verifyToken = (req: Request, res:Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) return res.status(404).json({ message: "Authentication token not available!!" });

    jwt.verify(token, process.env.SECRET_TOKEN, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }

        req.user_id = decoded.id;
        next();
    });
}


module.exports = { checkIfUserExists, checkRolesExists, verifyToken };