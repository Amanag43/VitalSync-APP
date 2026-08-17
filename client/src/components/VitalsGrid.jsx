import { StyleSheet, Text, View } from "react-native";
import {
  useVitalsStore,
  THRESHOLDS,
} from "../store/vitalsStore";
import VitalCard from "./VitalCard";

export default function VitalsGrid() {
  const vitals = useVitalsStore((s) => s.vitals);
function getVitalStatus(key, value) {
  const rule = THRESHOLDS[key];

  if (!rule || value == null) {
    return {
      status: "--",
      color: "#9CA3AF",
    };
  }

  const num = Number(value);

  if (num < rule.min || num > rule.max) {
    const below = rule.min - num;
    const above = num - rule.max;

    const critical =
      below > rule.min * 0.15 ||
      above > rule.max * 0.15;

    return critical
      ? {
          status: "Critical",
          color: "#EF4444",
        }
      : {
          status: "Warning",
          color: "#F59E0B",
        };
  }

  return {
    status: "Normal",
    color: "#22C55E",
  };
}
const heart = getVitalStatus(
  "heartRate",
  vitals?.heartRate?.value
);

const spo2 = getVitalStatus(
  "spo2",
  vitals?.spo2?.value
);

const temp = getVitalStatus(
  "bodyTemp",
  vitals?.bodyTemp?.value
);

const rr = getVitalStatus(
  "respiratoryRate",
  vitals?.respiratoryRate?.value
);

const steps = getVitalStatus(
  "steps",
  vitals?.steps?.value
);
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Live Vitals</Text>

      <View style={styles.grid}>

        <VitalCard
          icon="heart"
          iconColor="#EF4444"
          title="Heart Rate"
          value={vitals?.heartRate?.value}
          unit="bpm"
          status={heart.status}
          statusColor={heart.color}
        />

        <VitalCard
          icon="water"
          iconColor="#3B82F6"
          title="SpO₂"
          value={vitals?.spo2?.value}
          unit="%"
          status={spo2.status}
          statusColor={spo2.color}
        />

       <VitalCard
         icon="thermometer"
         iconColor="#F97316"
         title="Temperature"
         value={vitals?.bodyTemp?.value}
         unit="°C"
         status={temp.status}
         statusColor={temp.color}
       />
       <VitalCard
         icon="fitness"
         iconColor="#22C55E"
         title="Respiratory"
         value={vitals?.respiratoryRate?.value}
         unit="/min"
         status={rr.status}
         statusColor={rr.color}
       />

        <VitalCard
          icon="walk"
          iconColor="#8B5CF6"
          title="Steps"
          value={vitals?.steps?.value}
          unit=""
          status={steps.status}
          statusColor={steps.color}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },

  heading: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 16,
    color: "#fff",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
});