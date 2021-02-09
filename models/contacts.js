const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

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

ContactSchema.plugin(mongoosePaginate);
const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
