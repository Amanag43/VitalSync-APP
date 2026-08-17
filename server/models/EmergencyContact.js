const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    relation: {
      type: String,
      default: "Emergency Contact",
    },

    primary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "EmergencyContact",
  emergencyContactSchema
);