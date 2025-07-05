const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, 
  },
  interviewType: {
    type: String,
    enum: ["HR", "Technical"],
    required: true, 
  }, 
  scheduleDate: {
    type: Date,
    required: true,
  },
  message: String,
  isNotified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("ScheduledInterview", scheduleSchema);
