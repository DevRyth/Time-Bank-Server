import express, { Request, Response } from "express";
import mongoose, { ConnectOptions, Error } from "mongoose";
import cors from 'cors';

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/courses.routes');
const timebankRoutes = require('./routes/timebank.routes');
const autoIncrement = require('mongoose-auto-increment');
const Role = require('./model/role.model');
const { getRoles } = require('./helper/helper');

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const Connection = async () => {
    const db_url = process.env.DB_URL!;
    try {
        const connection = await mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions);
        autoIncrement.initialize(connection);
        console.log("Database Connected Successfully");
        initializeDatabase();
    }
    catch (err) {
        console.log('Error while connecting to the database ', err)
    }
}

Connection();

app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', courseRoutes);
app.use('/api/v1', timebankRoutes);
app.get('/api/v1', (req: Request, res: Response) => {
    res.json({ message: "root route" });
})

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

const initializeDatabase = () => {
    const roles = getRoles();
    for (let i = 0; i < roles.length; i++) {
        new Role({ name: roles[i] }).save((err: Error) => {
            if (err) console.log("error, role already present");
            else console.log(`Added a new role`);
        });
    }
}