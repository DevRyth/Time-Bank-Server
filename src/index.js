if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const db_url = require('./constants');
const authRoutes = require('./api/auth');
const userRoutes = require('./api/user');
const courseRoutes = require('./api/course');
const autoIncrement = require('mongoose-auto-increment');

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const Connection = async () => {
    try {
        const connection = await mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true});
        autoIncrement.initialize(connection);
        console.log("Database Connected Successfully");
    }
    catch(err) {
        console.log('Error while connecting to the database ', err)
    }
}

Connection();

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', courseRoutes);
app.get('/', (req, res) => {
    res.json({message: "root route"});
})

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});