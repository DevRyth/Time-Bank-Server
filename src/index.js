const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const auth = require('./api/auth');

const app = express();
app.use(cors());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/time-bank', {
    useNewUrlParser: true,
    // useCreateIndex: false,
    useUnifiedTopology: true,
    // useFindAndModify: false,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use('/', auth);

const port = 4000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});