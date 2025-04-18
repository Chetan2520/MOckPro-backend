const express = require('express');
const router = express.Router();
const Interview = require('../models/inteviewModel');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Token Endpoint
router.get('/token', (req, res) => {
  res.json({ token: process.env.VAPI_WEB_TOKEN });
});

// Generate Interview Questions
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
Thank you! <3`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawQuestions = await response.text();

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

module.exports = router;

