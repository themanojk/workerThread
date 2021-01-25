const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

// Create Schema
const UserSchema = new Schema(
    {
        _id: {
            type: String,
            default: uuidv4()
        },
        accountName: {
            type: String,
            required: false,
        },
        userId: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = User = mongoose.model("user_accounts", UserSchema);
