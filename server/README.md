<div align="center">

# 🩺 VitalSync

### Real-Time Health Monitoring & Intelligent Emergency Response Platform

Monitor vital signs in real time using Android Health Connect and automatically initiate emergency workflows when abnormal health conditions are detected.

![React Native](https://img.shields.io/badge/React%20Native-0.79-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-success?style=for-the-badge&logo=mongodb)
![Firebase](https://img.shields.io/badge/Firebase-Authentication-orange?style=for-the-badge&logo=firebase)
![Health Connect](https://img.shields.io/badge/Android-Health%20Connect-brightgreen?style=for-the-badge)

</div>

---

# 📖 Overview

VitalSync is a full-stack healthcare application built with **React Native**, **Node.js**, **Express**, and **MongoDB** that continuously monitors health metrics using **Android Health Connect**.

The application automatically evaluates incoming health data, detects abnormal conditions using configurable thresholds, and launches emergency workflows including hospital navigation and SOS notifications.

The goal of the project is to demonstrate how mobile health technologies, real-time communication, and location-based services can be combined into a scalable healthcare platform.

---

# ✨ Features

## 🩺 Real-Time Health Monitoring

- Android Health Connect integration
- Heart Rate monitoring
- Blood Oxygen (SpO₂)
- Body Temperature
- Respiratory Rate
- Daily Step Tracking
- Live Dashboard
- Historical Vital Storage

---

## 🚨 Emergency Detection

VitalSync continuously evaluates incoming health records.

When abnormal readings are detected, the system:

- Detects Warning & Critical conditions
- Starts emergency countdown
- Prevents duplicate incidents
- Locks repeated alerts
- Initiates emergency workflow

---

## 📍 Hospital Navigation

Integrated with:

- OpenStreetMap
- Overpass API
- OSRM Routing API

Capabilities:

- Discover nearby hospitals
- Display hospital markers
- Generate driving routes
- Turn-by-turn navigation
- Nearest hospital selection

---

## 📩 Emergency SOS

- Emergency Contact Management
- SOS Alert Generation
- Live Location Sharing
- GPS Coordinates
- Automatic Emergency Workflow

---

## 📊 Health Dashboard

- Live Vitals
- Sync Status
- Connection Status
- Health Status
- Health Trends
- Real-Time Updates

---

## 🔐 Authentication

- Firebase Authentication
- Secure Login
- User Management
- Protected Routes

---

# 🏗 Architecture

```
                Android Health Connect
                         │
                         ▼
                 Health Polling Engine
                         │
                         ▼
                  Threshold Evaluation
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
      Dashboard Update        Emergency Trigger
            │                         │
            ▼                         ▼
      WebSocket Updates      Hospital Navigation
            │                         │
            └────────────┬────────────┘
                         ▼
                 Node.js / Express API
                         │
                         ▼
                      MongoDB
```

---

# 🛠 Tech Stack

## Mobile

- React Native
- Expo
- Expo Router
- Zustand
- Health Connect
- Expo Location
- Expo SMS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- WebSocket

## Authentication

- Firebase Authentication

## Maps & Navigation

- OpenStreetMap
- Overpass API
- OSRM Routing API

---

# 📱 Screens

- Login
- Dashboard
- Live Health Status
- Health Trends
- Emergency Overlay
- Nearby Hospitals Map
- Emergency Contacts
- Edit Profile
- Settings

---

# 📡 Backend APIs

## Authentication

```
POST /login
POST /signup
```

## Vitals

```
POST /vitals
GET /history/:userId
```

## Emergency Contacts

```
GET /emergency-contacts/:userId
POST /emergency-contacts/:userId
DELETE /emergency-contacts/:userId/:contactId
```

---

# 📂 Project Structure

```
VitalSync

frontend/
│
├── app/
├── components/
├── services/
├── store/
├── engine/
├── theme/
└── utils/

backend/
│
├── controllers/
├── models/
├── routes/
├── websocket.js
├── server.js
└── config/
```

---

# 🚀 Future Roadmap

- AI-assisted health insights
- Medication reminders
- PDF health reports
- Caregiver dashboard
- Doctor portal
- Push notifications
- Wear OS support
- Cloud backup
- Advanced health analytics

---

# 🎯 Learning Outcomes

This project provided practical experience with:

- Full-stack Mobile Development
- REST API Development
- WebSocket Communication
- MongoDB Data Modeling
- Health Connect Integration
- React Native Architecture
- State Management
- Geolocation APIs
- Emergency Workflow Design

---

# 👨‍💻 Author

**Aman Agarwal**

GitHub: https://github.com/Amanag43

---

⭐ If you found this project interesting, consider starring the repository.
