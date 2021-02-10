const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => value.includes("@"),
      message: 'Email must contain "@"',
    },
  },
  password: { type: String, required: true },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: String,
  avatarURL: String,
  verificationToken: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
