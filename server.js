require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

const userRoute = require("./routes/userRoute");
const vapiRoutes = require("./routes/vapi");
const databaseRoute = require("./routes/databaseRoute");
const scheduledInterview = require("./routes/schedule");
const scheduleModel = require("./models/scheduleModel");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoute);
app.use("/api/vapi", vapiRoutes);
app.use("/api/database", databaseRoute);
app.use("/user", scheduledInterview);

// Base route
app.get("/", (req, res) => {
  res.send("Home Page");
});

// MongoDB connection and server start
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Mongoose Connected Successfully");

    // Start server only after DB connection
    app.listen(process.env.PORT, () => {
      console.log("🚀 Server running on port", process.env.PORT);
    });

    // ✅ Start Cron Job after DB is ready
    startCronJob();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// 📬 Email config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your app password
  }
});

// ⏰ Cron Job to check interview time every minute
function startCronJob() {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    try {
      const interviews = await scheduleModel.find({
        scheduleDate: { $lte: now },
        isNotified: { $ne: true },
      });

      for (const interview of interviews) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: interview.userId, // 👈 ensure userId is an email
          subject: "Interview Reminder",
          text: `Hi, this is a reminder for your ${interview.interviewType} interview scheduled at ${interview.scheduleDate}.\n\nMessage: ${interview.message}`,
        };

        await transporter.sendMail(mailOptions);
        await scheduleModel.findByIdAndUpdate(interview._id, { isNotified: true });

        console.log(`✅ Email sent to ${interview.userId}`);
      }
    } catch (err) {
      console.error("❌ Cron job error:", err);
    }
  });

  console.log("⏰ Cron job started: Checking interviews every minute");
}
