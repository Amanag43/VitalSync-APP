import { create } from "zustand";
import { router } from "expo-router";
import { sendSOSAlert } from "../services/emergencyservice";
import { BASE_URL } from "../config/api";
import { authenticatedFetch, getLatestVital, getVitalsHistory, createAlert } from "../services/apiService";

let _ws = null;

export const THRESHOLDS = {
  heartRate: { min: 45, max: 130, label: "Heart Rate", unit: "bpm" },
  spo2: { min: 92, max: 100, label: "SpO2", unit: "%" },
  respiratoryRate: {
    min: 10,
    max: 25,
    label: "Respiratory Rate",
    unit: "breaths/min",
  },
  bodyTemp: { min: 36.1, max: 37.5, label: "Body Temperature", unit: "°C" },
  steps: { min: 0, max: 20000, label: "steps", unit: "steps" },
};

export const useVitalsStore = create((set, get) => ({
  // Current Health Data
  vitals: null,
  vitalsHistory: [],
  lastSync: null,
  syncing: false,

  // User
  userId: null,

  // Connection
  wsConnected: false,

  // Emergency
  activeAlert: null,
  emergencyActive: false,
  lastTriggeredVitalSignature: null,

  // Health State
  lastStatus: "normal",

  setUserId: (id) => set({ userId: id }),

  startEmergency: (alert) => {
    console.log("Emergency Started", alert);
    set({
      activeAlert: alert,
      emergencyActive: true,
      lastStatus: "abnormal",
    });
  },

  stopEmergency: () => {
    console.log("Emergency UI Closed");
    set({
      activeAlert: null,
      emergencyActive: false,
    });
  },

  setStatus: (status) => set({ lastStatus: status }),

  fetchLatestFromBackend: async (userId) => {
    if (!userId) return;
    try {
      const res = await getLatestVital(userId);
      if (res.ok && res.vital?.vitals) {
        set({ lastSync: new Date().toISOString() });
        get().updateVitals(res.vital.vitals, true);
      }
    } catch (e) {
      console.log("[VitalsStore] Fetch latest error:", e.message);
    }
  },

  fetchHistoryFromBackend: async (userId, limit = 50) => {
    if (!userId) return;
    try {
      const res = await getVitalsHistory(userId, limit);
      if (res.ok && Array.isArray(res.vitals)) {
        set({ vitalsHistory: res.vitals });
      }
    } catch (e) {
      console.log("[VitalsStore] Fetch history error:", e.message);
    }
  },

  updateVitals: async (newVitals, isFromBackend = false) => {
    set({ vitals: newVitals });

    const { userId, emergencyActive, lastStatus, lastTriggeredVitalSignature } = get();

    if (!userId) {
      console.warn("[VitalsStore] No userId");
      return;
    }

    const alert = checkThresholds(newVitals);
    const currentStatus = alert ? "abnormal" : "normal";

    if (alert) {
      const rawObj = newVitals[alert.vitalKey];
      const timestamp = typeof rawObj === "object" ? rawObj?.timestamp : "";
      const currentSignature = `${alert.vitalKey}_${alert.value}_${timestamp}`;

      // Trigger emergency ONCE for this specific vital reading timestamp
      if (currentSignature !== lastTriggeredVitalSignature && !emergencyActive) {
        console.log(`[VitalsStore] 🚨 NEW abnormal vital reading (${currentSignature}) -> Triggering Emergency!`);
        set({ lastTriggeredVitalSignature: currentSignature });
        get().setStatus("abnormal");
        get().startEmergency(alert);

        router.push({
          pathname: "/(app)/map",
          params: {
            alertContext: JSON.stringify(alert),
          },
        });
      }
    } else {
      // Vitals returned to normal -> Reset signature lock
      if (lastTriggeredVitalSignature !== null) {
        set({ lastTriggeredVitalSignature: null });
      }
    }

    if (lastStatus === "abnormal" && currentStatus === "normal") {
      console.log("[VitalsStore] ✅ Patient recovered to normal vitals");
      get().setStatus("normal");
      if (emergencyActive) {
        get().stopEmergency();
      }
    }

    // ONLY sync local sensor readings to backend; do NOT re-sync data fetched from backend
    if (!isFromBackend) {
      await get().syncToBackend(
        newVitals,
        userId,
        currentStatus === "abnormal" ? alert.severity : "normal"
      );
    }
  },

  syncToBackend: async (vitals, userId, severity = "normal") => {
    set({ syncing: true });
    try {
      const payload = {
        userId,
        timestamp: new Date().toISOString(),
        vitals,
        severity,
      };

      const data = await authenticatedFetch(`${BASE_URL}/vitals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (data && data.ok) {
        set({ lastSync: new Date().toISOString() });
      }
    } catch (e) {
      console.error("[VitalsStore] Sync error:", e);
    } finally {
      set({ syncing: false });
    }
  },

  connectWebSocket: (userId) => {
    if (!userId) return;

    if (_ws && (_ws.readyState === WebSocket.OPEN || _ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    // Cleanly derive wss:// or ws:// from BASE_URL
    const wsScheme = BASE_URL.startsWith("https") ? "wss" : "ws";
    const cleanHost = BASE_URL.replace(/^https?:\/\//, "");
    const wsUrl = `${wsScheme}://${cleanHost}/ws?userId=${userId}`;

    console.log("[WS] Connecting to:", wsUrl);

    try {
      _ws = new WebSocket(wsUrl);

      _ws.onopen = () => {
        console.log("[WS] Connected successfully to:", wsUrl);
        set({ wsConnected: true });
        _ws.send(JSON.stringify({ type: "AUTH", userId }));
      };

      _ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          switch (msg.type) {
            case "PING":
              if (_ws && _ws.readyState === WebSocket.OPEN) {
                _ws.send(JSON.stringify({ type: "PONG" }));
              }
              break;

            case "CONNECTED":
              console.log("[WS] Authenticated for user:", msg.userId);
              set({ wsConnected: true });
              break;

            case "VITAL_ALERT":
              const { emergencyActive: isEmActive, lastTriggeredVitalSignature: lastSig } = get();
              const alertSig = `${msg.payload?.vitalKey || msg.payload?.vital}_${msg.payload?.value}_${msg.payload?.timestamp || ""}`;
              if (alertSig !== lastSig && !isEmActive) {
                console.log("[WS 🚨 VITAL ALERT]", msg.payload);
                set({ lastTriggeredVitalSignature: alertSig });
                get().startEmergency(msg.payload);
              }
              break;

            case "VITALS_UPDATE":
              if (msg.payload?.vitals) {
                set({ vitals: msg.payload.vitals });
              }
              break;
          }
        } catch (e) {
          console.error("[WS] Parse error:", e);
        }
      };

      _ws.onerror = (e) => console.log("[WS] Error:", e.message);
      _ws.onclose = () => {
        console.log("[WS] Connection closed -> Reconnecting in 3s...");
        set({ wsConnected: false });
        _ws = null;

        // Auto-reconnect backoff
        setTimeout(() => {
          const currentUid = get().userId;
          if (currentUid) {
            get().connectWebSocket(currentUid);
          }
        }, 3000);
      };
    } catch (e) {
      console.error("[WS] Init error:", e);
    }
  },

  disconnectWebSocket: () => {
    if (_ws) {
      _ws.close();
      _ws = null;
      set({ wsConnected: false });
    }
  },
}));

function checkThresholds(vitals) {
  if (!vitals) return null;
  const getVal = (item) => (item === null || item === undefined ? null : typeof item === "object" ? item.value : item);

  for (const [key, rule] of Object.entries(THRESHOLDS)) {
    const raw = vitals[key];
    const val = getVal(raw);
    if (val === null || val === undefined) continue;
    const num = Number(val);
    if (isNaN(num)) continue;

    if (num < rule.min || num > rule.max) {
      const isCritical = num < rule.min * 0.85 || num > rule.max * 1.15;
      return {
        vitalKey: key,
        vital: `${rule.label}: ${num} ${rule.unit}`,
        value: num,
        unit: rule.unit,
        severity: isCritical ? "critical" : "warning",
      };
    }
  }

  return null;
}