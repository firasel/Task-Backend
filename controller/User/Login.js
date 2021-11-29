const mongoose = require("mongoose");
const userSchema = require("../../schemas/userSchema");
const Users = new mongoose.model("users", userSchema);
const bcrypt = require("bcrypt");
const SendResponse = require("../../helper/SendResponse/SendResponse");
const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user is available or not
    const userData = await Users.findOne({ email }, { email: 1, password: 1 });

    if (userData) {
      bcrypt.compare(password, userData.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { email: userData.email },
            process.env.JWT_SECRET,
            { expiresIn: "7 days" }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res
            .status(200)
            .send(SendResponse(true, "Login Successful", { token }));
        } else {
          res.status(401).send(SendResponse(false, "Authentication failed"));
        }
      });
    } else {
      res.status(401).send(SendResponse(false, "Authentication failed"));
    }
  } catch (err) {
    res.status(500).send(SendResponse(false, "Internal Server Error"));
  }
};

module.exports = Login;
