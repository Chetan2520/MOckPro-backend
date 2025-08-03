// models/interviewFeedbackModel.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [String],
  answers: [String],
  feedback: {
    score: Number,
    strengths: String,
    weaknesses: String,
    improvementTips: String,
    metrics: {
      communication: Number,
      confidence: Number,
      fluency: Number
    }
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InterviewFeedback', feedbackSchema);
