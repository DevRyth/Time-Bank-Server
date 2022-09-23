import { Request, Response, NextFunction } from 'express';

import { loginSchemaValidator } from "../../schema-validator/auth.validator";

var Validator = require('jsonschema').Validator;
var v = new Validator();

export const validateLoginSchema = (req: Request, res: Response, next: NextFunction) => {
    try {
        v.validate(req.body, loginSchemaValidator, { throwError: true });
        req.body.username = req.body.username.toLowerCase();
        next();
    } catch (err: any) {
        return res.status(401).json({ message: err.property + " " + err.message });
    }
}
