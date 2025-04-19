require('dotenv').config();
const express = require("express");
const serverless = require('serverless-http');
const mongoose = require("mongoose");
const cors = require("cors");

const userRoute = require("./routes/userRoute");
const vapiRoutes = require('./routes/vapi');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoute);
app.use("/api/vapi", vapiRoutes);

app.get("/", (req, res) => {
  res.send("Home Page");
});

// MongoDB connection (initialize once)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.URI);
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
connectDB(); // Call once

app.listen(process.env.PORT,()=>{
  console.log(`working on ${process.env.PORT}`)
})
// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
