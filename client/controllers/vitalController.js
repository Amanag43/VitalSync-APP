const Vital = require("../models/Vital");
const { broadcastToUser } = require("../websocket");

exports.saveVitals = async (req, res) => {
  try {
    const {
      severity,
      vitals,
      source,
      timestamp,
    } = req.body;

    const userId = req.user.uid;

    if (!vitals) {
      return res.status(400).json({
        success: false,
        message: "Vitals are required.",
      });
    }
  
    const triggeredAlert =
      severity === "warning" || severity === "critical";

    const vital = await Vital.create({
      userId,
      severity: severity || "normal",
      timestamp: timestamp || new Date(),
      source: source || "health_connect",
      triggeredAlert,
      vitals,
    });


    broadcastToUser(userId, {
      type: "VITALS_UPDATE",
      payload: {
        vitals,
        severity,
        timestamp: vital.createdAt,
      },
    });


    // if (triggeredAlert) {
    //   broadcastToUser(userId, {
    //     type: "VITAL_ALERT",
    //     payload: {
    //       severity,
    //       vitals,
    //       timestamp: vital.createdAt,
    //     },
    //   });
    // }

    return res.status(201).json({
      success: true,
      message: "Vitals saved successfully.",
      vital,
    });
  } catch (err) {
    console.error("[VitalController]", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Vital.find({
      userId: req.user.uid,
    })
      .sort({
        createdAt: -1,
      })
      .limit(50);

    return res.json({
      success: true,
      count: history.length,
      history,
    });
  } catch (err) {
    console.error("[VitalController]", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
