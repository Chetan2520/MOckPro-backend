const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  userId: String, // could be an email
  interviewType: String,
  scheduleDate: Date,
  message: String,
  isNotified: { type: Boolean, default: false }
});

module.exports = mongoose.model("Schedule", scheduleSchema);
