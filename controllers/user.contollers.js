const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


async function Signup(req, res) {
  try {
    console.log(req.body)
    const { username, email, password } = req.body;
    console.log(username, email, password);
    const user = await User.findOne({ email });
    if (user) return res.send("user already exist");

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        await User.create({
          username,
          email,
          password: hash,
        });
        const userToken = jwt.sign({ email }, "secret");
        console.log("hey")
        res.status(201).cookie("userToken", userToken).json("success");
      });
    });
  } catch (error) {
    if (error) return res.status(400).json(error.message);
  }
}

async function Login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User Not Exist" });

    bcrypt.compare(password, user.password, (err, result) => {
      if (!result) return res.status(400).json({ error: "Password incorrect" });

      const userToken = jwt.sign({ email }, "secret");
      return res
        .status(200)
        .cookie("userToken", userToken,{
          sameSite:true
        })
        .json({ msg: "Success" });
    });
  } catch (error) {
    return res.status(400).json({ error: "User Not Exist" });
  }
}

async function Logout(req,res) {
    res.cookie("userToken","").json({msg:"token remove"})
}

module.exports = { Signup, Login,Logout};