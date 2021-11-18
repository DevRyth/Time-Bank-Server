const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
    },
    middle_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    gender: {
        type: String,
    },
    birth_date: {
        type: Number,
    },
    birth_month: {
        type: Number,
    },
    birth_year: {
        type: Number,
    },
    address: {
        type: String,
    },
    district: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    phone_no: {
        type: String,
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);