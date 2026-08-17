const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    // User
    userId: {
      type: String,
      required: true,
      index: true,
    },

    // Triggered Vital
    vital: {
      type: String,
      required: true,
    },

    value: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      default: "",
    },

    severity: {
      type: String,
      enum: ["warning", "critical"],
      default: "warning",
    },

    // Emergency Status
    status: {
      type: String,
      enum: [
        "active",
        "sos_sent",
        "hospital_selected",
        "resolved",
      ],
      default: "active",
    },

    // Snapshot of all vitals (Mixed to accept both numeric values or telemetry objects)
    vitals: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Location
    location: {
      latitude: Number,
      longitude: Number,
    },

    // Hospital Information
    hospital: {
      name: String,
      distance: Number,
      eta: Number,
    },

    // SOS Information
    sosSent: {
      type: Boolean,
      default: false,
    },

    contactsNotified: {
      type: Number,
      default: 0,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alert", alertSchema);