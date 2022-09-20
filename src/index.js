if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./api/auth');
const userRoutes = require('./api/user');
const courseRoutes = require('./api/course');
const timebankRoutes = require('./api/timebank');
const autoIncrement = require('mongoose-auto-increment');
const Role = require('./model/role');
const { getRoles } = require('./helper/helper');

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const Connection = async () => {
    const db_url = process.env.DB_URL;
    try {
        const connection = await mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true });
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
app.get('/api/v1', (req, res) => {
    res.json({ message: "root route" });
})

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

initializeDatabase = () => {
    const roles = getRoles();
    for (let i = 0; i < roles.length; i++) {
        new Role({ name: roles[i] }).save(err => {
            if (err) console.log("error, role already present");
            else console.log(`Added a new role`);
        });
    }
}