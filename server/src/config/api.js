import { Platform } from "react-native";

// 24/7 Unthrottled Live AWS EC2 Production Backend
const AWS_EC2_URL = "http://65.0.105.12:5000";
const LOCAL_URL   = Platform.OS === "android" ? "http://192.168.1.12:5000" : "http://localhost:5000";

// In standalone APK builds (!__DEV__), ALWAYS use live AWS EC2 URL
// In local development (__DEV__), fallback to local IP or AWS EC2 URL
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  (__DEV__ ? AWS_EC2_URL : AWS_EC2_URL);

console.log(`[VitalSync API Config] 🌐 Mode: ${__DEV__ ? "LOCAL DEV" : "AWS PRODUCTION"} | Target: ${BASE_URL}`);