const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserInfoSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    middle_name: {
        type: String,
    },
    last_name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    birth_date: {
        type: Number,
        required: true,
    },
    birth_month: {
        type: Number,
        required: true,
    },
    birth_year: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: Number,
        required: true,
    },
    phone_number: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('UserInfo', UserInfoSchema);