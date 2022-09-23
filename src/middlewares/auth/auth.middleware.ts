import { NextFunction, Request, Response } from "express";

const jwt = require("jsonwebtoken");


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
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

