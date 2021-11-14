if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./api/auth');
const userRoutes = require('./api/user');

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// mongodb+srv://dba:timebank@time-bank.kny3u.mongodb.net/TimeBank?retryWrites=true&w=majority


// // 'mongodb://localhost:27017/time-bank'

// mongoose.connect(db_url, {
//     useNewUrlParser: true,
//     // useCreateIndex: false,
//     useUnifiedTopology: true,
//     // useFindAndModify: false,
// })

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });

const Connection = async () => {
    const db_url = "mongodb+srv://dba:timebank@time-bank.kny3u.mongodb.net/TimeBank?retryWrites=true&w=majority";
    try {
        await mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("Database Connected Successfully");
    }
    catch(err) {
        console.log('Error while connecting to the database ', err)
    }
}

Connection();

app.use('/', authRoutes);
app.use('/', userRoutes);
app.get('/', (req, res) => {
    res.json({message: "root route"});
})

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});