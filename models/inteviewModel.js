// backend/models/Interview.js
const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  role: String,
  type: String,
  level: String,
  questions: [String],  // Array of strings for the questions
  finalized: Boolean,
  userid: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
