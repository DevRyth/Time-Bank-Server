const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const durationSchema  = new Schema({
    start:{
        type:String,
        required:true
    },
    end:
    {
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Duration', durationSchema);