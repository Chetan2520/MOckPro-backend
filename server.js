require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/userRoute");
const vapiRoutes = require("./routes/vapi");
const databaseRoute = require("./routes/databaseRoute");
const scheduledInterview = require("./routes/schedule");
const scheduleModel = require("./models/scheduleModel");
const userAuth = require("./Auth/userAuth");

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoute);
app.use("/api/vapi", userAuth, vapiRoutes);
app.use("/api/database", userAuth, databaseRoute);
app.use("/api/user", userAuth, scheduledInterview);

// Base route
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Nodemailer transporter (global use)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Cron job function
function startCronJob() {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    try {
      const interviews = await scheduleModel.find({
        scheduleDate: { $lte: now },
        isNotified: { $ne: true },
      });

      console.log("📅 Found interviews:", interviews.length);

      for (const interview of interviews) {
        console.log("📨 Sending to:", interview.userId);

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: interview.userId,
          subject: "Interview Reminder",
          text: `Hi, this is a reminder for your ${interview.interviewType} interview scheduled at ${interview.scheduleDate}.\n\nMessage: ${interview.message}`,
        });

        await scheduleModel.findByIdAndUpdate(interview._id, { isNotified: true });

        console.log(`✅ Email sent to ${interview.userId}`);
      }
    } catch (err) {
      console.error(" Cron job error:", err);
    }
  });

  console.log(" Cron job started: Checking interviews every minute");
}

// MongoDB connection and server start
mongoose.connect(process.env.URI)
  .then(() => {
    console.log("✅ Mongoose Connected Successfully");

    app.listen(process.env.PORT, () => {
      console.log(" Server running on port", process.env.PORT);
    });

    startCronJob(); // Start cron only after DB is connected
  })
  .catch((err) => { 
    console.error("MongoDB connection error:", err);
  });

module.exports = transporter; // So you can import in other files
