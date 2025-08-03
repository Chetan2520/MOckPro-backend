const express = require('express');
const router = express.Router();
const Interview = require('../models/inteviewModel');
const InterviewFeedback = require('../models/feedbackModel'); // ✅ Tumhara model
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Token Endpoint
router.get('/token', (req, res) => {
  res.json({ token: process.env.VAPI_WEB_TOKEN });
});

// ✅ Generate Interview Questions
router.post('/generate-text', async (req, res) => {
  const { type, role, level, techstack, amount, userid } = req.body;

  if (!type || !role || !level || !techstack || !amount || !userid) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Prepare questions for a job interview.
    The job role is ${role}.
    The job experience level is ${level}.
    The tech stack used in the job is: ${techstack}.
    The focus between behavioural and technical questions should lean toward: ${type}.
    The amount of questions required is: ${amount}.
    Please return only the questions, without any other text or explanation.
    The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters.
    Return the questions formatted like this:
    ["Question 1","Question 2","Question 3"]
    Thank you! <3;`


    const result = await model.generateContent(prompt);
    const rawQuestions = await result.response.text();
    const questions = JSON.parse(rawQuestions);

    const newInterview = new Interview({
      role,
      type,
      level,
      questions,
      finalized: true,
      userid,
    });

    await newInterview.save();

    res.json({ success: true, questions });

  } catch (error) {
    console.error('Error generating or saving interview:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});


// ✅ NEW → Auto Feedback Generation (Submit Interview)
router.post('/submit-interview', async (req, res) => {
  const { userid, interviewId, answers } = req.body;

  if (!userid || !interviewId || !answers) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // ✅ Get Interview Questions
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const questions = interview.questions;

    // ✅ Call Gemini for Feedback
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
You are an expert interview evaluator. Candidate answers are given. Provide feedback in JSON.

Questions and Answers:
${questions.map((q, i) => `Q: ${q}\nA: ${answers[i]}`).join('\n\n')}

Return strictly:
{
  "score": Number,
  "strengths": "string",
  "weaknesses": "string",
  "improvementTips": "string",
  "metrics": {
    "communication": Number,
    "confidence": Number,
    "fluency": Number
  }
}`;

    const result = await model.generateContent(prompt);
    const rawText = await result.response.text();
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const feedback = JSON.parse(cleaned);

    // ✅ Save Feedback in DB
    await InterviewFeedback.create({
      userid,
      questions,
      answers,
      feedback
    });

    res.json({ success: true, message: 'Interview submitted & feedback generated', feedback });

  } catch (error) {
    console.error('Error generating auto feedback:', error.message);
    res.status(500).json({ success: false, message: 'Failed to process interview', error: error.message });
  }
});


// ✅ Get All Feedback
router.get("/all-feedback", async (req, res) => {
  try {
    const allFeedback = await InterviewFeedback.find();
    res.status(200).json(allFeedback);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
