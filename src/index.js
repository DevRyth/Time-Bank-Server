const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const auth = require('./api/auth');

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// mongodb+srv://dba:<password>@time-bank.kny3u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority


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
    const db_url = "mongodb+srv://dba:DevRyth@timebank.kny3u.mongodb.net/TimeBank?retryWrites=true&w=majority";
    try {
        await mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("Database Connected Successfully");
    }
    catch(err) {
        console.log('Error while connecting to the database ', err)
    }
}

Connection();

app.use('/', auth);

const port = 4000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});