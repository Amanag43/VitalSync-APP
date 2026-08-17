<div align="center">

  # 🫀 VitalSync Telemetry & AI Diagnostic Engine

  **Production-Grade IoT Patient Telemetry, AI Health Assistant & Real-Time Emergency Response System**

  [![AWS EC2](https://img.shields.io/badge/AWS_EC2-24%2F7_Active-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](http://65.0.105.12:5000/health)
  [![Node.js](https://img.shields.io/badge/Node.js-v20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
  [![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Cloud-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
  [![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_52-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
  [![Jest](https://img.shields.io/badge/Jest-100%25_Pass-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

  <br />

  [📥 Download Android APK (v1.0.0)](https://github.com/Amanag43/vitalsync-backend/releases/latest) • [🌐 Live Server Status](http://65.0.105.12:5000/health) • [📖 API Reference](#-api-endpoints-reference)

</div>

---

## 🌟 Key Features

VitalSync is an enterprise-grade IoT health monitoring ecosystem built for real-time patient telemetry, automated clinical risk scoring, and instant emergency dispatch.

### 🩺 1. Real-Time Telemetry & Multi-Sensor Integration
- **5 Core Vitals Ingestion**: Continuous sensor data streaming for **Heart Rate** (bpm), **Blood Oxygen / SpO₂** (%), **Body Temperature** (°C), **Respiratory Rate** (breaths/min), and cumulative daily **Steps**.
- **Android Health Connect Sync**: Direct native hook to Android Health Connect Toolbox with 24-hour lookback freshness windows.
- **Sparkline Visual Analytics**: Interactive 5-vital trend graphs with **Daily**, **Weekly**, **Monthly**, and **Yearly** resolution filters.

### 🤖 2. AI Health Assistant Diagnostic Engine (`/api/ai/insights/:userId`)
- **7-Day Telemetry Diagnostic**: Computes rolling 7-day average metrics across all vital parameters.
- **Dynamic Stability Scoring**: Algorithmic health stability index ($0 - 100$) reflecting cardiovascular & respiratory balance.
- **Clinical Tips Generator**: Automated contextual recommendations based on anomalous vitals.

### 🚨 3. Automated Emergency SOS Dispatch & Debouncing
- **Threshold Detection**: Instant identification of warning (< 15% deviation) and critical (< 30% deviation) vital breaches.
- **Single-Alert Cooldown Lock**: 15-minute backend alert debouncing engine to prevent duplicate database spam while vitals remain abnormal.
- **Native Emergency SOS**: Automated 5-second countdown with native pre-filled SMS dispatch (location link, patient name, severity, exact vitals) to saved emergency contacts.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client Layer
        A["📱 VitalSync Android App (Expo / React Native)"]
        HC["🩺 Android Health Connect Sensors"] --> A
    end

    subgraph Transport & Security
        A <-->|WSS WebSockets 24/7| B["⚡ AWS EC2 Server (65.0.105.12:5000)"]
        A <-->|HTTPS REST API| B
    end

    subgraph Backend Services
        B --> C["🚨 Emergency & Threshold Engine"]
        B --> D["🤖 AI Diagnostic Health Assistant"]
        B --> E["🔐 Token & Auth Middleware"]
    end

    subgraph Data & Cloud Layer
        C --> F["🍃 MongoDB Atlas Cloud Database"]
        D --> F
    end
```

---

## ⚡ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Mobile App** | React Native, Expo SDK 52, Expo Router | Cross-platform mobile client with glassmorphism UI |
| **Backend Server** | Node.js, Express.js, PM2 | High-concurrency RESTful API & WebSockets server |
| **Database** | MongoDB Atlas Cloud | Scalable NoSQL telemetry & alert storage |
| **Real-Time Stream**| `ws` (WebSocket Protocol) | 24/7 bidirectional real-time telemetry streaming |
| **Hosting & Cloud** | AWS EC2 (Ubuntu 24.04 LTS) | 24/7 unthrottled instance with 100% uptime |
| **Testing & CI/CD** | Jest, Supertest, GitHub Actions | Automated unit/integration test suite |

---

## 📡 API Endpoints Reference

### 🟢 System Health
`GET /health` — Live server status, timestamp & uptime verification.

### 💓 Telemetry Vitals
`POST /vitals` — Ingest local sensor telemetry payload.  
`GET /vitals/:userId` — Fetch latest recorded vitals snapshot for a patient.  
`GET /vitals/history/:userId` — Fetch historical telemetry entries (supports `?limit=50`).

### 🤖 AI Diagnostic Health Assistant
`GET /api/ai/insights/:userId` — Generates 7-day stability score, metric averages, and clinical summary.

### 🚨 Alerts & Emergency
`GET /alerts/:userId` — Query active & historical emergency alert documents.  
`POST /alerts` — Manually log alert document with 15-minute cooldown check.  
`POST /emergency-contacts/:userId` — Save emergency contact details.

---

## 🧪 Testing Suite & Quality Assurance

Automated unit & integration test suite powered by **Jest** and **Supertest**:

```bash
# Run local automated test suite
npm test
```

```text
PASS tests/api.test.js
  VitalSync Telemetry & AI API Suite
    Threshold & Vital Validation Tests
      ✓ POST /vitals with valid readings returns success
      ✓ POST /vitals with abnormal respiratory rate identifies threshold breach
    Alert History Query Tests
      ✓ GET /alerts/:userId returns alerts array structure
    AI Diagnostic Health Assistant Tests
      ✓ GET /api/ai/insights/:userId returns clinical metrics & score
```

---

## 🚀 Deployment Instructions

### Local Development Setup
```bash
# Clone the repository
git clone https://github.com/Amanag43/vitalsync-backend.git
cd vitalsync-backend

# Install dependencies
npm install

# Start local dev server
npm run dev
```

### Production Deployment on AWS EC2
```bash
# Install Node.js 20 & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git
sudo npm install -g pm2

# Start server 24/7
pm2 start server.js --name "vitalsync-backend"
pm2 save
```

---

## 📄 License & Author

Developed by **Aman Agarwal**. Licensed under the [MIT License](LICENSE).
