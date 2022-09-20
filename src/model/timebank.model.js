const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const TimeBankSchema = new Schema({
    time: {
        type: 'Number',
        required: true,
        default: 100
    },
    usedTime: {
        type: Number,
        default: 0
    },
    earnedTime: {
        type: Number,
        default: 0
    }
});


autoIncrement.initialize(mongoose.connection);
TimeBankSchema.plugin(autoIncrement.plugin, {
  model: 'TimeBank',
  field: 'timebank_id',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('TimeBank', TimeBankSchema);