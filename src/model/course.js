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
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
  },

  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  schedule: [
    {
      appointmentId: {
        type: Schema.Types.ObjectId,
        ref: "Appointment"
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