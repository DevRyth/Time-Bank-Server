const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
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
    user_info: {
        type: Schema.Types.ObjectId,
        ref: "UserInfo"
    },
    time_bank: {
        type: Schema.Types.ObjectId,
        ref: "TimeBank"
    },
    courses: [
        {
            type: Schema.Types.ObjectId,
            ref: "Course"
        }
    ],
    enrolled: [
        {
            course: {
                type: Schema.Types.ObjectId,
                ref: "Course"
            },
            appointment_id: {
                type: Number,
            }
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

autoIncrement.initialize(mongoose.connection);
UserSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'user_id',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('User', UserSchema);

