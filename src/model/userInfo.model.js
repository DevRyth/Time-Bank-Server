const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const UserInfoSchema = new Schema({
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

autoIncrement.initialize(mongoose.connection);
UserInfoSchema.plugin(autoIncrement.plugin, {
  model: 'UserInfo',
  field: 'userinfo_id',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('UserInfo', UserInfoSchema);