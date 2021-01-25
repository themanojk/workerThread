const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

// Create Schema
const PolicyInfoSchema = new Schema(
    {
        _id: {
            type: String,
            default: uuidv4()
        },
        policyNumber: {
            type: String,
            required: false,
        },
        policyStartDate: {
            type: String,
            required: false,
        },
        policyEndDate: {
            type: String,
            required: false,
        },
        categoryId: {
            type: String,
            required: false,
        },
        companyId: {
            type: String,
            ref: 'policy_carriers',
            required: false,
        },
        userId: {
            type: String,
            ref: 'users',
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = PolicyInfo = mongoose.model("policy_info", PolicyInfoSchema);
