import {
  initialize,
  requestPermission,
  readRecords,
  getSdkStatus,
} from "react-native-health-connect";
import { Platform } from "react-native";

const PERMISSIONS = [
  { accessType: "read", recordType: "HeartRate" },
  { accessType: "read", recordType: "OxygenSaturation" },
  { accessType: "read", recordType: "RespiratoryRate" },
  { accessType: "read", recordType: "BodyTemperature" },
  { accessType: "read", recordType: "Steps" },
];
const VITAL_LOOKBACK_MINUTES = 1440; // 24 hours lookback for test data & toolbox insertions
const FRESHNESS_MINUTES = 1440;     // 24 hours freshness window
//initializehealthconnect
export async function initializeHealthConnect() {
  if (Platform.OS !== "android") return false;

  try {
    const status = await getSdkStatus();

    if (status !== 3) {
      console.warn("Health Connect unavailable");
      return false;
    }

    await initialize();
    console.log("✅ Health Connect initialized");
    return true;
  } catch (e) {
    console.error("Health Connect Init:", e);
    return false;
  }
}

export async function requestHealthPermissions() {
  try {
    const granted = await requestPermission(PERMISSIONS);
    const grantedTypes = new Set(granted?.map((p) => p.recordType));
    const missing = PERMISSIONS.filter(
      (p) => !grantedTypes.has(p.recordType)
    );

    if (missing.length > 0) {
      console.warn(
        " Missing Health Connect permissions:",
        missing.map((p) => p.recordType).join(", ")
      );
      return false;
    }

    console.log("Health permissions granted");
    return true;
  } catch (e) {
    console.error("Permission Error:", e);
    return false;
  }
}
function getRecordTime(record) {
  if (record?.time) return record.time;
  if (record?.samples?.length) {
    return record.samples.at(-1)?.time ?? record.startTime;
  }
  return record?.startTime;
}

function getLatest(response) {
  if (!response?.records?.length) return null;

  return response.records.reduce((latest, current) => {
    const latestTime = new Date(getRecordTime(latest)).getTime();
    const currentTime = new Date(getRecordTime(current)).getTime();
    return currentTime > latestTime ? current : latest;
  });
}

function isFresh(record, maxAgeMinutes = FRESHNESS_MINUTES) {
  if (!record) return false;

  const recordTime = new Date(getRecordTime(record)).getTime();
  if (Number.isNaN(recordTime)) return false;

  const age = Date.now() - recordTime;
  return age < maxAgeMinutes * 60 * 1000;
}

export async function readLatestVitals() {
  if (Platform.OS !== "android") return null;

  try {
    const endTime = new Date();
    const vitalsStartTime = new Date(
      endTime.getTime() - VITAL_LOOKBACK_MINUTES * 60 * 1000
    );
    const vitalsFilter = {
      operator: "between",
      startTime: vitalsStartTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    const stepsStartTime = new Date();
    stepsStartTime.setHours(0, 0, 0, 0); // Start of today
    const stepsFilter = {
      operator: "between",
      startTime: stepsStartTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    const [
      heartRateResponse,
      spo2Response,
      respiratoryResponse,
      temperatureResponse,
      stepsResponse,
    ] = await Promise.all([
      readRecords("HeartRate", { timeRangeFilter: vitalsFilter }),
      readRecords("OxygenSaturation", { timeRangeFilter: vitalsFilter }),
      readRecords("RespiratoryRate", { timeRangeFilter: vitalsFilter }),
      readRecords("BodyTemperature", { timeRangeFilter: vitalsFilter }),
      readRecords("Steps", { timeRangeFilter: stepsFilter }),
    ]);

    const hr = getLatest(heartRateResponse);
    const spo2 = getLatest(spo2Response);
    const rr = getLatest(respiratoryResponse);
    const temp = getLatest(temperatureResponse);
    const totalStepsToday = stepsResponse?.records?.length
      ? stepsResponse.records.reduce((sum, r) => sum + (r.count || 0), 0)
      : null;

    return {
      heartRate:
        hr && isFresh(hr)
          ? {
              value: hr.samples?.at(-1)?.beatsPerMinute ?? null,
              unit: "bpm",
              timestamp: getRecordTime(hr),
            }
          : null,
      spo2:
        spo2 && isFresh(spo2)
          ? {
              value: spo2.percentage ?? null,
              unit: "%",
              timestamp: spo2.time,
            }
          : null,
      respiratoryRate:
        rr && isFresh(rr)
          ? {
              value: rr.rate ?? null,
              unit: "breaths/min",
              timestamp: rr.time,
            }
          : null,
      bodyTemp:
        temp && isFresh(temp)
          ? {
              value: typeof temp.temperature === "object" ? temp.temperature?.inCelsius : temp.temperature,
              unit: "°C",
              timestamp: temp.time || getRecordTime(temp),
            }
          : null,
      steps: totalStepsToday !== null
        ? {
            value: totalStepsToday,
            unit: "steps",
            timestamp: new Date().toISOString(),
          }
        : null,
    };
  } catch (e) {
    console.error("Health Connect Read Error:", e);
    return null;
  }
}