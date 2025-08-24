const express = require("express");
const router = express.Router();
const scheduleModel = require("../models/scheduleModel");
const transporter = require("../server"); // import transporter

// 📬 Route to schedule interview
router.post("/scheduleInterview", async (req, res) => {
  try {
    const { userId, interviewType, scheduleDate, message } = req.body;

    const newSchedule = new scheduleModel({
      userId,
      interviewType,
      scheduleDate,
      message,
      isNotified: false,
    });

    await newSchedule.save();

    res.status(200).json({ success: true, msg: "Interview scheduled" });
  } catch (err) {
    console.error("❌ Schedule error:", err);
    res.status(500).json({ success: false, msg: "Failed to schedule" });
  }
});

//send data to frontend

router.get("/find-scheduled", async (req, res) => {
  const scheduledData = await scheduleModel.find();
  res.status(200).json({ success: true, data: scheduledData });
});

// 📬 Test route to manually send email
router.post("/testEmail", async (req, res) => {
  try {
    const { to } = req.body;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: "MockPro Test Email",
      text: "This is a test email from MockPro backend 🚀",
    });

    console.log("✅ Manual email sent:", info.response);
    res.status(200).json({ success: true, msg: "Test email sent" });
  } catch (err) {
    console.error("❌ Manual email error:", err);
    res.status(500).json({ success: false, msg: "Failed to send test email" });
  }
});

module.exports = router;
