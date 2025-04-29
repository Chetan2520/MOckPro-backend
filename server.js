require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const dotenv = require("dotenv");
const cors = require("cors");

const userRoute = require("./routes/userRoute");
const vapiRoutes = require('./routes/vapi');
const databaseRoute=require("./routes/databaseRoute")


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use("/api/users", userRoute);
app.use("/api/vapi", vapiRoutes);
app.use("/api/database", databaseRoute);

// DB connection and server start
mongoose.connect(process.env.URI)
  .then(() => {
    console.log("Mongoose Connected Successfully");
    app.listen(process.env.PORT, () => {
      console.log("Server running on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
  

  app.get("/",(req,res)=>{
    res.send("Home Page");
  })