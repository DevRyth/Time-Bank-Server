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
      duration: {
        type: Schema.Types.ObjectId,
        ref: Duration,
      },
      availablity: {
        type: boolean,
      },
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
