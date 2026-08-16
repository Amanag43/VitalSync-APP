const mongoose = require("mongoose");

const ReadingSchema = new mongoose.Schema(
  {
    value: mongoose.Schema.Types.Mixed,
    unit: String,
    timestamp: String,
  },
  { _id: false }
);

const VitalSchema = new mongoose.Schema(
  {
    // User
    userId: {
      type: String,
      required: true,
      index: true,
    },

    // Reading Time
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Overall Status
    severity: {
      type: String,
      enum: ["normal", "warning", "critical"],
      default: "normal",
    },

    // Data Source
    source: {
      type: String,
      enum: ["health_connect", "manual", "api"],
      default: "health_connect",
    },

    // Whether this reading triggered an emergency
    triggeredAlert: {
      type: Boolean,
      default: false,
    },

    // Complete vital snapshot
    vitals: {
      heartRate: ReadingSchema,
      spo2: ReadingSchema,
      respiratoryRate: ReadingSchema,
      bodyTemp: ReadingSchema,
      bloodPressure: ReadingSchema,
      steps: ReadingSchema,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete raw readings after 90 days
VitalSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 90,
  }
);

module.exports = mongoose.model("Vital", VitalSchema);