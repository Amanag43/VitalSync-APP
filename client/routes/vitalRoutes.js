const express = require("express");
const router  = express.Router();
const Vital   = require("../models/Vital");
const Alert   = require("../models/Alert");
const { broadcastToUser } = require("../websocket");
const { authenticate, requireMatchingUser } = require("../middleware/authenticate");

router.use(authenticate);

// Thresholds
const THRESHOLDS = {
  heartRate:       { min: 45,   max: 130,  label: "Heart Rate",      unit: "bpm"          },
  spo2:            { min: 92,   max: 100,  label: "SpO2",            unit: "%"            },
  respiratoryRate: { min: 10,   max: 25,   label: "Respiratory Rate", unit: "breaths/min"  },
  bodyTemp:        { min: 35.5, max: 38.5, label: "Body Temperature", unit: "°C"          },
};

function checkThresholds(vitals) {
  const alerts = [];
  for (const [key, rule] of Object.entries(THRESHOLDS)) {
    const reading = vitals[key];
    if (!reading) continue;
    const value = typeof reading === "object" ? reading.value : reading;
    const num = parseFloat(value);
    if (isNaN(num)) continue;
    if (num < rule.min || num > rule.max) {
      const severity = num < rule.min * 0.85 || num > rule.max * 1.15 ? "critical" : "warning";
      alerts.push({ vitalKey: key, vital: `${rule.label}: ${num} ${rule.unit}`, value: num, unit: rule.unit, severity });
    }
  }
  return alerts;
}

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

router.post("/", async (req, res) => {
  try {
    const { timestamp, vitals, severity } = req.body;
    const userId = req.user.uid;

    if (!vitals) {
      return res.status(400).json({ error: "vitals are required" });
    }

    // Save Vital to MongoDB
    const doc = await Vital.create({
      userId,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      vitals,
      severity: severity || "normal",
    });

    // Check thresholds server-side
    const serverAlerts = checkThresholds(vitals);
    if (serverAlerts.length > 0) {
      const worst = serverAlerts.sort((a, b) =>
        b.severity.localeCompare(a.severity)
      )[0];

      // Check if an active alert for the SAME vital exists within 15 minutes (Strict 1-Alert Cooldown)
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
      const existingAlert = await Alert.findOne({
        userId,
        vital: worst.vital,
        createdAt: { $gte: fifteenMinsAgo },
      });

      if (!existingAlert) {
        try {
          await Alert.create({
            userId,
            vital: worst.vital,
            value: Number(worst.value) || 0,
            unit: worst.unit || "",
            severity: worst.severity,
            vitals: sanitizeVitals(vitals),
            status: "active",
            createdAt: new Date(),
          });
          console.log(`[VitalRoutes] 🚨 Created Single Alert document for ${userId}: ${worst.vital}`);
        } catch (err) {
          console.log("[VitalRoutes] Alert save notice:", err.message);
        }

        // Broadcast WS alert ONLY when a new alert document is created
        broadcastToUser(userId, {
          type: "VITAL_ALERT",
          payload: {
            ...worst,
            patientName: "Patient",
            timestamp: doc.timestamp.toISOString(),
          },
        });
      } else {
        console.log(`[VitalRoutes] ⏸️ Skipped duplicate alert (Cooldown Active) for ${worst.vital}`);
      }
    }

    return res.status(201).json({
      ok: true,
      id: doc._id,
      alerts: serverAlerts,
    });
  } catch (e) {
    console.error("[POST /vitals]", e);
    return res.status(500).json({ error: e.message });
  }
});

router.get("/:userId/latest", requireMatchingUser, async (req, res) => {
  try {
    const doc = await Vital.findOne({ userId: req.user.uid })
      .sort({ timestamp: -1 })
      .lean();

    if (!doc) return res.status(404).json({ error: "No vitals found" });
    return res.json({ ok: true, vital: doc });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get("/:userId", requireMatchingUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { limit = 50, since } = req.query;

    const query = { userId };
    if (since) query.timestamp = { $gte: new Date(since) };

    const docs = await Vital.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .lean();

    return res.json({ ok: true, count: docs.length, vitals: docs });
  } catch (e) {
    console.error("[GET /vitals]", e);
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
