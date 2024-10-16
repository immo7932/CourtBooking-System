const userModel = require("../models/Users.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const crypto = require("crypto");

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new userModel({ name, email, password, role });
    // console.log(name, email, password, role);

    const resp = await user.save();

    const data = {
      user: { id: user._id },
    };

    const authToken = jwt.sign(
      data,
    
      
      "b0742345623214e7f5aac75a4200799d80b55d26a62b97cd23015c33ae3ac11513e2e7",
      { expiresIn: 600 }
    );
    return res.status(201).json({ success: true, user: resp, authToken });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error. Unable to create User." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await userModel.findAndValidate(email, password);

    if (!foundUser) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Extract the userId from the foundUser
    const userId1 = foundUser._id;

    const data = {
      user: { id: userId1 },
    };

    const authToken = jwt.sign(
      data,
      "b0742345623214e7f5aac75a4200799d80b55d26a62b97cd23015c33ae3ac11513e2e7",
      { expiresIn: 600 }
    );

    // Send the userId1 and authToken back to the frontend
    return res.status(200).json({
      success: true,
      userId1,
      authToken, // You might also want to send the authToken to the frontend
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error. Unable to login." });
  }
};

module.exports = { createUser, loginUser };
