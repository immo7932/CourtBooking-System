const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures email is unique
      lowercase: true, // Converts email to lowercase
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["manager", "customer"], // Role can only be 'manager' or 'customer'
      default: "customer", // Default role is 'customer'
      required: true,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields

UserSchema.statics.findAndValidate = async function (email, password) {
  const foundUser = await this.findOne({ email });
  console.log(foundUser);
  if (!foundUser) {
    return false;
  }
  if (foundUser.password == password) {
    return true;
  }
  return false;
};
module.exports = mongoose.model("Users", UserSchema);
