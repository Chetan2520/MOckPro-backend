require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const dotenv = require("dotenv");
const cors = require("cors");

const userRoute = require("./routes/userRoute");
const vapiRoutes = require('./routes/vapi');

// dotenv.config();   
// const path = require("path");
// app.use(express.static(path.join(__dirname, "client", "build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoute);
app.use("/api/vapi", vapiRoutes);

// DB connection and server start
mongoose.connect(process.env.URI)
  .then(() => {
    console.log("Mongoose Connected Successfully");
    app.listen(process.env.PORT, () => {
      console.log("Server running on port", process.env.PORT || 8000);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
