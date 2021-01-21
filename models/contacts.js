const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => value.includes("@"),
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
  },
  token: {
    type: String,
    default: "",
  },
});

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
