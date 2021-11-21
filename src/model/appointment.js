const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema  = new Schema({
    start:{
        type:String,
        required:true
    },
    duration:
    {
        type:String,
        required:true
    },
    day:
    {
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);