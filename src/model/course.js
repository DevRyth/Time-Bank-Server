const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const courseSchema=new Schema({
    title:{
        type: String,
        required: true,
    },
    summary:
    {
        type:String,
        required:true
    },
    difficulty:
    {
        type:String,
        required:true
    },

    available:{
        type:boolean
    },
    duration:
    {

        type: Schema.Types.ObjectId,
        ref:Duration

    }
});

module.exports = mongoose.model('Course', courseSchema);
