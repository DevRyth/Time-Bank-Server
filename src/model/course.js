const mongoose = require("mongoose");
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
      appointment: {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
      availablity: {
        type: Boolean,
      },
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
