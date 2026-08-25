<div align="center">

  # 🫀 VitalSync – IoT Health Telemetry & AI Emergency Platform

  **Enterprise-Grade Real-Time Medical Telemetry, AI Health Assistant & Automated SOS Dispatch System**

  [![AWS EC2](https://img.shields.io/badge/AWS_EC2-24%2F7_Active_Production-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](http://65.0.105.12:5000/health)
  [![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_57-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
  [![Node.js](https://img.shields.io/badge/Node.js-v20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
  [![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Cloud-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
  [![Jest](https://img.shields.io/badge/Jest-100%25_Pass-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

  <br />

  [📥 Download Android APK (v1.0.0)](https://github.com/Amanag43/VitalSync-APP/releases/latest) • [🌐 Live Server Status](http://65.0.105.12:5000/health) • [📖 API Documentation](#-api-reference)

</div>

---

## 🌟 Executive Overview

**VitalSync** is a production-ready, full-stack IoT patient monitoring platform engineered for high-concurrency vital telemetry streaming, automated clinical risk scoring, and sub-5-second emergency SOS dispatch.

Built to address the critical gap between wearable health data and immediate emergency intervention, VitalSync continuously streams 5 core vital parameters from **Android Health Connect** sensors to a Node.js/Express backend hosted **24/7 on AWS EC2** with persistent **WebSocket (`wss`)** connections and **MongoDB Atlas** cloud storage.

---

## ✨ Key System Features

### 🩺 1. Real-Time Telemetry & Multi-Sensor Integration
- **5 Core Vitals Streamed**: Ingests **Heart Rate** (bpm), **Blood Oxygen / $\text{SpO}_2$** (%), **Body Temperature** (°C), **Respiratory Rate** (breaths/min), and cumulative daily **Steps**.
- **Android Health Connect Engine**: Native hook into Android Health Connect Toolbox with 24-hour lookback freshness windows and dual-format (Celsius/Fahrenheit) temperature normalization.
- **Interactive Sparkline Analytics**: Custom multi-period trend visualizations with **Daily**, **Weekly**, **Monthly**, and **Yearly** resolution filters.

### 🤖 2. AI Health Assistant Diagnostic Engine (`/api/ai/insights/:userId`)
- **7-Day Telemetry Diagnostic**: Computes rolling 7-day average metrics across all vital parameters to establish a patient baseline.
- **Dynamic Stability Scoring**: Algorithmic health stability index ($0 - 100$) reflecting cardiovascular & respiratory equilibrium.
- **Clinical Tips Generator**: Automated contextual risk classification (Optimal, Warning, Critical) with patient recommendations.

### 🚨 3. 15-Minute Alert Debouncing Engine & Cooldown Lock
- **Anomalous Threshold Detection**: Real-time evaluation against clinical thresholds with warning (< 15% deviation) and critical (< 30% deviation) classification.
- **State Machine Debouncing**: Object-oriented alert debouncing logic that enforces a 15-minute single-alert lock per vital condition, **reducing duplicate database spam by ~99%** while vitals remain abnormal.

### 🗺️ 4. Automated SOS Dispatch & Geolocation Routing
- **Sub-5-Second Hospital Lookup**: Integrates **OpenStreetMap**, **Overpass API**, and **OSRM (Open Source Routing Machine)** for nearest hospital discovery and turn-by-turn routing.
- **Native Emergency Dispatch**: Automated 5-second countdown modal with pre-filled SMS dispatch containing live GPS location links, patient name, medical profile, severity, and exact vitals data.

### 🔐 5. Security, OAuth & Session Persistence
- **Google OAuth & Firebase Auth**: Secure Google Sign-In integration with Firebase credential exchange and Zustand session persistence.
- **50MB Express Payload Gateway**: High-capacity base64 avatar upload processing with strict CORS & Bearer token middleware validation.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Mobile App Layer (Client)
        HC["🩺 Android Health Connect Sensors"] --> RN["📱 React Native App (Expo SDK 57)"]
        RN --> ZU["⚡ Zustand Centralized State Store"]
        RN --> GA["🔐 Google OAuth / Firebase Auth"]
    end

    subgraph Transport & Communication Layer
        RN <-->|Bidirectional WSS WebSockets 24/7| EC2["🚀 AWS EC2 Server (65.0.105.12:5000)"]
        RN <-->|RESTful HTTPS APIs| EC2
    end

    subgraph Backend Micro-Services (Server)
        EC2 --> AE["🚨 Alert Debouncing Engine (15m Cooldown)"]
        EC2 --> AI["🤖 AI Health Assistant Diagnostic Service"]
        EC2 --> PM2["🔄 PM2 Process Manager & Keep-Alive"]
    end

    subgraph Data & Third-Party Layer
        AE --> DB["🍃 MongoDB Atlas Cloud Database"]
        AI --> DB
        RN --> OSM["🗺️ OpenStreetMap / OSRM / Overpass API"]
    end
```

---

## ⚡ Technology Stack

### **Mobile Client (`/client`)**
- **Framework**: React Native, Expo SDK 57, Expo Router (File-based Routing)
- **UI & Animation**: Glassmorphic Midnight Dark Theme, `@expo/vector-icons`, Custom SVG Sparklines
- **Sensors**: `expo-health-connect`, `expo-location`, `expo-sms`
- **State & Auth**: Zustand (Persistent Storage), Firebase Auth, Google Sign-In

### **Backend Server (`/server`)**
- **Runtime & Framework**: Node.js v20.x, Express.js
- **Database**: MongoDB Atlas Cloud (Mongoose ODM)
- **Real-Time Engine**: `ws` (WebSocket Protocol with JSON Heartbeats)
- **Infrastructure**: AWS EC2 (Ubuntu 24.04 LTS), PM2 Process Manager, Systemd
- **Testing & Quality**: Jest, Supertest, GitHub Actions CI/CD

---

## 📡 API Endpoints Reference

### 🟢 System Health & Diagnostics
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Live server status, timestamp, and uptime verification |
| `GET` | `/` | API status metadata & endpoint documentation directory |

### 💓 Telemetry & Vitals
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/vitals` | Ingest local sensor telemetry payload |
| `GET` | `/api/vitals/:userId` | Fetch latest recorded vitals snapshot for a patient |
| `GET` | `/api/vitals/history/:userId` | Fetch historical telemetry entries (supports `?limit=50`) |

### 🤖 AI Diagnostic Health Assistant
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/ai/insights/:userId` | Computes 7-day stability score ($0-100$), metric averages, and clinical summary |

### 🚨 Alerts & Emergency Profile
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/alerts/:userId` | Query active & historical emergency alert documents |
| `POST` | `/api/alerts` | Manually log alert document with 15-minute cooldown validation |
| `PUT` | `/api/profile/:userId` | Create/Update user health profile (supports 50MB avatar payloads) |

---

## 🧪 Automated Testing & Quality Assurance

The backend features a comprehensive automated test suite powered by **Jest** and **Supertest**:

```bash
# Run backend test suite
cd server
npm test
```

```text
PASS tests/api.test.js
  VitalSync Telemetry & AI API Suite
    Threshold & Vital Validation Tests
      ✓ POST /vitals with valid readings returns success (520 ms)
      ✓ POST /vitals with abnormal respiratory rate identifies threshold breach (142 ms)
    Alert History Query Tests
      ✓ GET /alerts/:userId returns alerts array structure (66 ms)
    AI Diagnostic Health Assistant Tests
      ✓ GET /api/ai/insights/:userId returns clinical metrics & score (95 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        6.275 s
```

---

## 📂 Monorepo Repository Structure

```text
VitalSync-APP/
├── client/                     # React Native / Expo Mobile App
│   ├── src/
│   │   ├── app/                # Expo Router screen hierarchy ((app), (auth))
│   │   ├── components/         # Glassmorphic UI components & cards
│   │   ├── config/             # Base API & Firebase configuration
│   │   ├── services/           # Health Connect, OSRM, and API services
│   │   └── store/              # Zustand vitalsStore & authStore
│   ├── app.json                # Expo configuration & plugins
│   └── package.json
│
├── server/                     # Node.js Express Telemetry Backend
│   ├── config/                 # MongoDB Atlas connection & Firebase Admin
│   ├── controllers/            # AI, Alert, Vital, and Profile controllers
│   ├── middleware/             # Token auth & payload validation
│   ├── models/                 # Mongoose schema models (Alert, UserProfile)
│   ├── routes/                 # API route definitions
│   ├── tests/                  # Jest & Supertest integration suite
│   ├── server.js               # Express entrypoint & keep-alive ping
│   ├── websocket.js            # WebSocket server & JSON PING/PONG heartbeat
│   └── package.json
│
├── .gitignore                  # Root security ignore rules
└── README.md                   # Full-Stack Documentation
```

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- **Node.js**: v20.x or higher
- **Android Studio / Physical Phone**: Android 8.0+ (API Level 26+) for Health Connect sensors
- **EAS CLI**: `npm install -g eas-cli`

### 2. Local Setup
```bash
# Clone the Monorepo
git clone https://github.com/Amanag43/VitalSync-APP.git
cd VitalSync-APP

# Setup Backend Server
cd server
npm install
npm run dev

# Setup Mobile Client (In a separate terminal window)
cd ../client
npm install
npx expo start --clear
```

### 3. Production EAS Build (Android `.apk`)
```bash
cd client
eas build -p android --profile preview
```

---

## 📄 License & Author

Developed by **Aman Agarwal**. Licensed under the [MIT License](LICENSE).
