const Alert = require("../models/Alert");

function sanitizeVitals(rawVitals) {
  if (!rawVitals || typeof rawVitals !== "object") return {};
  const getVal = (item) => (item === null || item === undefined ? null : typeof item === "object" ? item.value : item);

  return {
    heartRate: getVal(rawVitals.heartRate),
    spo2: getVal(rawVitals.spo2),
    respiratoryRate: getVal(rawVitals.respiratoryRate),
    bodyTemp: getVal(rawVitals.bodyTemp),
    steps: getVal(rawVitals.steps),
  };
}

// Create Alert
exports.createAlert = async (req, res) => {
  try {
    const {
      vital,
      value,
      unit,
      severity,
      vitals,
      location,
      hospital,
      sosSent,
      contactsNotified,
    } = req.body;

    const userId = req.user.uid;

    if (!vital || value === undefined) {
      return res.status(400).json({
        success: false,
        message: "Vital information is incomplete.",
      });
    }

    // 15-minute cooldown check to prevent duplicate alert documents
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const existingAlert = await Alert.findOne({
      userId,
      vital,
      createdAt: { $gte: fifteenMinsAgo },
    });

    if (existingAlert) {
      console.log(`[Alert Controller] ⏸️ Skipped duplicate alert creation for ${vital}`);
      return res.json({
        success: true,
        message: "Alert already active for this condition.",
        alert: existingAlert,
      });
    }

    // Create Alert document in MongoDB
    const alert = await Alert.create({
      userId,
      vital,
      value: Number(value) || 0,
      unit: unit || "",
      severity: severity || "warning",
      vitals: sanitizeVitals(vitals),
      location,
      hospital,
      sosSent: sosSent || false,
      contactsNotified: contactsNotified || 0,
      status: "active",
      createdAt: new Date(),
    });

    console.log(`[Alert Controller] ✅ Created Single Alert document ${alert._id} for user ${userId}`);

    return res.status(201).json({
      success: true,
      alert,
    });
  } catch (err) {
    console.error("[Alert] Create Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Alert History
exports.getAlertsByUser = async (req, res) => {
  try {
    const targetUserId = req.params.userId || req.user.uid;

    const alerts = await Alert.find({
      $or: [
        { userId: targetUserId },
        { userId: req.user.uid },
        { userId: "user123" },
      ],
    }).sort({
      createdAt: -1,
    });

    console.log(`[Alert Controller] Found ${alerts.length} alerts for user query (${targetUserId} / ${req.user.uid})`);

    return res.json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (err) {
    console.error("[Alert] History Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Resolve Alert
exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id },
      {
        status: "resolved",
        resolvedAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found.",
      });
    }

    return res.json({
      success: true,
      alert,
    });
  } catch (err) {
    console.error("[Alert] Resolve Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
