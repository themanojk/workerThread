const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema(
  {
    _id: {
      type: String,
    },
    firstName: {
      type: String,
      required: false,
    },
    dob: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    zipCode: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      default: true,
    },
    gender: {
      type: String,
      require: false,
    },
    userType: {
      type: String,
      require: false
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User = mongoose.model("users", UserSchema);
