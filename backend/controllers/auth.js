const userModel = require("../models/Users.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input before saving
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters." });
  }

  try {
    // Check if the email is already in use
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists." }); // Conflict status
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({ name, email, password: hashedPassword, role });

    // Save the user to the database
    const savedUser = await user.save();

    // Return success response with the created user data
    return res.status(201).json({ success: true, user: savedUser });
  } catch (err) {
    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Invalid data. Please check your inputs.",
        details: err.errors,
      });
    }

    // Handle other errors, such as database connection issues
    return res.status(500).json({
      error: "Server error. Unable to create user.",
      details: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("dd");
  try {
    // Find the user by email
    const foundUser = await userModel.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Extract the userId and any other data you want to send
    const userId1 = foundUser._id;
    const userData = {
      id: userId1,
      name: foundUser.name, // Include the user's name
      email: foundUser.email, // Include the user's email
      role: foundUser.role, // Include the user's role (if applicable)
      // Add more fields as needed
    };

    const data = {
      user: { id: userId1 },
    };

    const authToken = jwt.sign(
      data,
      "b0742345623214e7f5aac75a4200799d80b55d26a62b97cd23015c33ae3ac11513e2e7",
      { expiresIn: 600 } // Token expires in 10 minutes
    );

    // Send the userId and user data back to the frontend
    return res.status(200).json({
      success: true,
      userId: userId1,
      authToken,
      user: userData, // Send the user data back
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error. Unable to login." });
  }
};

module.exports = { createUser, loginUser };
