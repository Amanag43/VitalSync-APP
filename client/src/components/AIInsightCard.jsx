import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useVitalsStore } from "../store/vitalsStore";
import { theme } from "../theme/theme";

export default function AIInsightCard() {
  const vitals = useVitalsStore((s) => s.vitals);

  const insight = useMemo(() => {
    if (!vitals) {
      return {
        icon: "time-outline",
        title: "Waiting for data",
        message:
          "Health Connect hasn't provided enough information yet.",
      };
    }

    const hr = vitals.heartRate?.value;
    const spo2 = vitals.spo2?.value;
    const temp = vitals.bodyTemp?.value;
    const rr = vitals.respiratoryRate?.value;

    if (temp > 38) {
      return {
        icon: "thermometer",
        title: "High Temperature",
        message:
          "Your body temperature is elevated. Continue monitoring and stay hydrated.",
      };
    }

    if (spo2 && spo2 < 92) {
      return {
        icon: "warning",
        title: "Low Oxygen",
        message:
          "Your oxygen saturation is below the healthy range. Seek medical attention if this continues.",
      };
    }

    if (hr && hr > 120) {
      return {
        icon: "heart",
        title: "High Heart Rate",
        message:
          "Your heart rate is elevated. Rest for a few minutes and monitor any symptoms.",
      };
    }

    if (rr && rr > 25) {
      return {
        icon: "fitness",
        title: "Rapid Breathing",
        message:
          "Your respiratory rate is above normal. Observe your breathing pattern.",
      };
    }

    return {
      icon: "checkmark-circle",
      title: "Everything Looks Good",
      message:
        "Your monitored vitals are currently within a healthy range. Keep maintaining your routine.",
    };
  }, [vitals]);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.icon}>
          <Ionicons
            name={insight.icon}
            size={24}
            color={theme.colors.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{insight.title}</Text>
          <Text style={styles.message}>
            {insight.message}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  icon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  title: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 16,
  },

  message: {
    marginTop: 6,
    color: theme.colors.muted,
    lineHeight: 22,
    fontSize: 13,
  },
});