require("dotenv").config();
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("../config/db");

// Increase test timeout for cloud MongoDB Atlas latency
jest.setTimeout(30000);

// Express test app setup
const app = express();
app.use(express.json());

// Import routes
const alertRoutes = require("../routes/alertRoutes");
const vitalRoutes = require("../routes/vitalRoutes");
const aiRoutes = require("../routes/aiRoutes");

app.use("/alerts", alertRoutes);
app.use("/vitals", vitalRoutes);
app.use("/api/ai", aiRoutes);

const TEST_TOKEN = "Bearer dev-token-test_user_123";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("VitalSync Telemetry & AI API Suite", () => {

  describe("Threshold & Vital Validation Tests", () => {
    test("POST /vitals with valid readings returns success", async () => {
      const payload = {
        vitals: {
          heartRate: { value: 75, unit: "bpm" },
          spo2: { value: 98, unit: "%" },
          bodyTemp: { value: 36.6, unit: "°C" },
        },
      };

      const res = await request(app)
        .post("/vitals")
        .set("Authorization", TEST_TOKEN)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("ok", true);
    });

    test("POST /vitals with abnormal respiratory rate identifies threshold breach", async () => {
      const payload = {
        vitals: {
          respiratoryRate: { value: 45, unit: "breaths/min" },
        },
      };

      const res = await request(app)
        .post("/vitals")
        .set("Authorization", TEST_TOKEN)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.alerts).toHaveLength(1);
      expect(res.body.alerts[0]).toHaveProperty("vitalKey", "respiratoryRate");
      expect(res.body.alerts[0]).toHaveProperty("severity", "critical");
    });
  });

  describe("Alert History Query Tests", () => {
    test("GET /alerts/:userId returns alerts array structure", async () => {
      const res = await request(app)
        .get("/alerts/test_user_123")
        .set("Authorization", TEST_TOKEN);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(Array.isArray(res.body.alerts)).toBe(true);
    });
  });

  describe("AI Diagnostic Health Assistant Tests", () => {
    test("GET /api/ai/insights/:userId returns clinical metrics & score", async () => {
      const res = await request(app)
        .get("/api/ai/insights/test_user_123")
        .set("Authorization", TEST_TOKEN);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("overallScore");
      expect(res.body).toHaveProperty("statusLabel");
      expect(res.body).toHaveProperty("summary");
      expect(Array.isArray(res.body.recommendations)).toBe(true);
    });
  });

});
