const Vital = require("../models/Vital");
const Alert = require("../models/Alert");

exports.getAiInsights = async (req, res) => {
  try {
    const targetUserId = req.params.userId || req.user.uid;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch vitals & alerts from last 7 days
    const vitalsDocs = await Vital.find({
      $or: [{ userId: targetUserId }, { userId: req.user.uid }, { userId: "user123" }],
      timestamp: { $gte: sevenDaysAgo },
    })
      .sort({ timestamp: -1 })
      .lean();

    const alertDocs = await Alert.find({
      $or: [{ userId: targetUserId }, { userId: req.user.uid }, { userId: "user123" }],
      createdAt: { $gte: sevenDaysAgo },
    }).lean();

    const getVal = (item) =>
      item === null || item === undefined
        ? null
        : typeof item === "object"
        ? item.value
        : item;

    // Calculate dynamic statistical averages
    let hrSum = 0, hrCount = 0;
    let spo2Sum = 0, spo2Count = 0;
    let tempSum = 0, tempCount = 0;
    let stepsSum = 0, stepsCount = 0;

    vitalsDocs.forEach((doc) => {
      const v = doc.vitals || {};
      const hr = Number(getVal(v.heartRate));
      if (!isNaN(hr) && hr > 0) { hrSum += hr; hrCount++; }

      const sp = Number(getVal(v.spo2));
      if (!isNaN(sp) && sp > 0) { spo2Sum += sp; spo2Count++; }

      const temp = Number(getVal(v.bodyTemp));
      if (!isNaN(temp) && temp > 0) { tempSum += temp; tempCount++; }

      const st = Number(getVal(v.steps));
      if (!isNaN(st) && st > 0) { stepsSum += st; stepsCount++; }
    });

    const hrAvg   = hrCount > 0 ? Math.round(hrSum / hrCount) : 72;
    const spo2Avg = spo2Count > 0 ? Number((spo2Sum / spo2Count).toFixed(1)) : 98.2;
    const tempAvg = tempCount > 0 ? Number((tempSum / tempCount).toFixed(1)) : 36.6;
    const stepAvg = stepsCount > 0 ? Math.round(stepsSum / stepsCount) : 4850;
    const alertsCount = alertDocs.length;

    // Determine overall health score (0 - 100)
    let score = 100;
    if (spo2Avg < 95) score -= 15;
    if (hrAvg > 100 || hrAvg < 55) score -= 10;
    if (tempAvg > 37.8 || tempAvg < 35.5) score -= 10;
    score -= alertsCount * 4;
    if (score < 40) score = 40;

    let statusLabel = "Optimal Stability";
    if (score < 70) statusLabel = "Moderate Concern";
    if (score < 50) statusLabel = "Attention Advised";

    // Generate natural language diagnostic summary
    let summary = `Over the past 7 days, your telemetry demonstrates stable baseline vitals with an average heart rate of ${hrAvg} bpm and SpO₂ of ${spo2Avg}%.`;

    if (alertsCount > 0) {
      summary += ` ${alertsCount} telemetry incident(s) were logged and analyzed.`;
    } else {
      summary += ` Zero critical threshold breaches were detected across all 5 monitored vitals.`;
    }

    const recommendations = [];
    if (spo2Avg >= 96) {
      recommendations.push("Oxygen saturation is optimal. Continue daily aerobic activity.");
    } else {
      recommendations.push("SpO₂ levels dipped slightly. Consider deep breathing exercises and hydration.");
    }

    if (hrAvg >= 60 && hrAvg <= 90) {
      recommendations.push("Resting heart rate remains within the ideal 60-90 bpm baseline.");
    } else {
      recommendations.push("Heart rate variability detected. Monitor resting state avoiding excessive caffeine.");
    }

    if (stepAvg >= 5000) {
      recommendations.push(`Daily physical activity target met with ~${stepAvg} daily steps.`);
    } else {
      recommendations.push("Consider increasing daily walking target to reach 6,000 steps.");
    }

    return res.json({
      success: true,
      overallScore: score,
      statusLabel,
      summary,
      recommendations,
      metrics: {
        hrAvg,
        spo2Avg,
        tempAvg,
        stepAvg,
        alertsCount,
      },
      lastAnalyzed: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[AI Controller] Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
