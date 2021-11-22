const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },

  schedule: [
    {
      appointmentId: {
        type: Number,
      },
      availablity: {
        type: Boolean,
      },
    },
  ],
});

autoIncrement.initialize(mongoose.connection);
courseSchema.plugin(autoIncrement.plugin, {
  model: 'Course',
  field: 'course_id',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model("Course", courseSchema);