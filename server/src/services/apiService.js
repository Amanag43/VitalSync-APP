import { BASE_URL } from "../config/api";
import { auth } from "../config/firebase";
import { useAuthStore } from "../store/authStore";

const safeFetch = async (url, options = {}) => {
  try {
    console.log(`[API Request] ➔ ${options.method || "GET"} ${url}`);
    const res = await fetch(url, options);
    const text = await res.text();
    
    if (text.startsWith("<") || text.startsWith("<!DOCTYPE") || text.includes("<html")) {
      console.warn(`[API Endpoint Notice] HTTP ${res.status} from ${url} returned HTML page.`);
      const err = new Error(`API Endpoint Not Found (HTTP ${res.status})`);
      err.status = res.status;
      err.isHtml404 = true;
      throw err;
    }
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) {
      const error = new Error(data?.message || data?.error || `Request failed with status ${res.status}`);
      error.status = res.status;
      throw error;
    }
    console.log(`[API Response] ✔ HTTP ${res.status} from ${url}`);
    return data;
  } catch (err) {
    console.warn(`[API Failure] ❌ ${url}:`, err.message);
    throw err;
  }
};

export const authenticatedFetch = async (url, options = {}) => {
  let token = null;

  try {
    const user = auth?.currentUser;
    if (user) {
      token = await user.getIdToken(true);
    }
  } catch (e) {
    console.log("Firebase token fetch warning:", e.message);
  }

  // Fallback dev token for local testing if Firebase user isn't logged in
  if (!token) {
    const storeUser = useAuthStore.getState().user;
    const uid = storeUser?.id || storeUser?.uid || "user123";
    token = `dev-token-${uid}`;
  }

  return safeFetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

// PROFILE API
export const getProfile = (userId) => authenticatedFetch(`${BASE_URL}/api/profile/${userId}`);

export const createProfile = (profile) =>
  authenticatedFetch(`${BASE_URL}/api/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

export const updateProfile = (userId, profile) =>
  authenticatedFetch(`${BASE_URL}/api/profile/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

// ALERTS API
export const getAlerts = async (userId) => {
  return await authenticatedFetch(`${BASE_URL}/alerts/${userId}`);
};

export const createAlert = async (data) => {
  return await authenticatedFetch(`${BASE_URL}/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const resolveAlertApi = async (alertId) => {
  return await authenticatedFetch(`${BASE_URL}/alerts/${alertId}/resolve`, {
    method: "PATCH",
  });
};

// VITALS API
export const sendVitals = async (data) => {
  return await authenticatedFetch(`${BASE_URL}/vitals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const getVitalsHistory = async (userId, limit = 50) => {
  return await authenticatedFetch(`${BASE_URL}/vitals/${userId}?limit=${limit}`);
};

export const getLatestVital = async (userId) => {
  return await authenticatedFetch(`${BASE_URL}/vitals/${userId}/latest`);
};

// AI DIAGNOSTIC HEALTH ASSISTANT API
export const getAiInsights = async (userId) => {
  return await authenticatedFetch(`${BASE_URL}/api/ai/insights/${userId}`);
};
