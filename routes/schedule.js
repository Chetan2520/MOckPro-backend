const express = require("express");
const router = express.Router();
const scheduleModel = require("../models/scheduleModel");

router.post("/scheduleInterview", async (req, res) => {
  try {
    const { userId, interviewType, scheduleDate, message } = req.body;

    const scheduledInterview = await scheduleModel.create({
      userId,
      interviewType,
      scheduleDate,
      message
    });

    res.json({ success: true, scheduledInterview });

  } catch (error) {
    res.status(500).json({ msg: error.message }); // better to use error.message
  }
});

module.exports = router; // ✅ Export router
