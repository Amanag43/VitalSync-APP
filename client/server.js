require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const { attachWebSocket } = require("./websocket");

const alertRoutes = require("./routes/alertRoutes");
const vitalRoutes = require("./routes/vitalRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const profileRoutes = require("./routes/profileRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
connectDB();

app.use(cors());
// Set 50mb payload limit to allow avatar photo uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Root Homepage Route
app.get("/", (req, res) => {
  res.json({
    name: "VitalSync Telemetry & AI Backend API",
    version: "1.0.0",
    status: "Online & Active",
    documentation: {
      health: "/health",
      vitals: "/vitals",
      alerts: "/alerts",
      profile: "/api/profile",
      aiInsights: "/api/ai/insights/:userId"
    }
  });
});

// Health Check Route for Render & Uptime Monitors
app.get("/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString(), status: "healthy" });
});

// ROUTES (Mount both with and without /api prefix for complete backwards compatibility)
app.use("/alerts", alertRoutes);
app.use("/api/alerts", alertRoutes);

app.use("/vitals", vitalRoutes);
app.use("/api/vitals", vitalRoutes);

app.use("/emergency-contacts", emergencyRoutes);
app.use("/api/emergency-contacts", emergencyRoutes);

app.use("/api/profile", profileRoutes);
app.use("/profile", profileRoutes);

app.use("/api/ai", aiRoutes);

// IMPORTANT: allow external access
const port = Number(process.env.PORT) || 5000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  // Self-Ping Heartbeat every 10 minutes to prevent Render free instance sleeping
  setInterval(() => {
    http.get(`http://127.0.0.1:${port}/health`, () => {
      console.log("[Keep-Alive] Self heartbeat ping successful");
    }).on("error", (e) => {
      console.log("[Keep-Alive] Ping notice:", e.message);
    });
  }, 10 * 60 * 1000);
});

attachWebSocket(server);
