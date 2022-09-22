const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const appointmentSchema = new Schema({
    start: {
        type: String,
        required: true
    },
    duration:
    {
        type: String,
        required: true
    },
    day:
    {
        type: String,
        required: true
    }
});

autoIncrement.initialize(mongoose.connection);
appointmentSchema.plugin(autoIncrement.plugin, {
    model: 'Appointment',
    field: 'appointment_id',
    startAt: 1,
    incrementBy: 1
});

export { }

module.exports = mongoose.model('Appointment', appointmentSchema);