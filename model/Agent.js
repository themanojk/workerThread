const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

// Create Schema
const AgentSchema = new Schema(
    {
        _id: {
            type: String,
            default: uuidv4()
        },
        agentName: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = Agent = mongoose.model("agents", AgentSchema);
