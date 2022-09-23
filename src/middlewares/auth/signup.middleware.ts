import { Request, Response, NextFunction } from 'express';
import { signupSchemaValidator } from "../../schema-validator/auth.validator";
import { Error } from "mongoose";
import { getRoles } from '../../helper/helper';


const User = require("../../model/user.model");

var Validator = require('jsonschema').Validator;
var v = new Validator();


export const validateSignupSchema = (req: Request, res: Response, next: NextFunction) => {
    try {
        v.validate(req.body, signupSchemaValidator, { throwError: true });
        req.body.username = req.body.username.toLowerCase();
        req.body.email = req.body.email.toLowerCase();
        next();
    } catch (err: any) {
        return res.status(401).json({ message: err.property + " " + err.message });
    }
}

export const checkIfUserExists = async (req: Request, res: Response, next: NextFunction) => {

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

export const checkRolesExists = (req: Request, res: Response, next: NextFunction) => {
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
