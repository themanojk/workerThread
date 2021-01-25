const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

// Create Schema
const MessageSchema = new Schema(
    {
        _id: {
            type: String,
            default: uuidv4()
        },
        message: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = Messages = mongoose.model("messages", MessageSchema);
