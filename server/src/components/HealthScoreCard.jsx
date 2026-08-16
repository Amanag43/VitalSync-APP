import { StyleSheet, Text, View } from "react-native";
import { useMemo } from "react";
import { useVitalsStore } from "../store/vitalsStore";
import { theme } from "../theme/theme";

export default function HealthScoreCard() {
  const vitals = useVitalsStore((s) => s.vitals);

  const { score, status, message } = useMemo(() => {
    if (!vitals) {
      return {
        score: "--",
        status: "Waiting...",
        message: "Waiting for Health Connect data.",
      };
    }

    let score = 100;

    if (vitals.heartRate?.value) {
      const hr = vitals.heartRate.value;
      if (hr < 45 || hr > 130) score -= 25;
    }

    if (vitals.spo2?.value) {
      const spo2 = vitals.spo2.value;
      if (spo2 < 92) score -= 30;
    }

    if (vitals.bodyTemp?.value) {
      const temp = vitals.bodyTemp.value;
      if (temp < 36.1 || temp > 37.5) score -= 20;
    }

    if (vitals.respiratoryRate?.value) {
      const rr = vitals.respiratoryRate.value;
      if (rr < 10 || rr > 25) score -= 25;
    }

    score = Math.max(0, score);

    if (score >= 90) {
      return {
        score,
        status: "Excellent",
        message: "All monitored vitals are within the healthy range.",
      };
    }

    if (score >= 75) {
      return {
        score,
        status: "Good",
        message: "Minor changes detected. Continue monitoring.",
      };
    }

    if (score >= 50) {
      return {
        score,
        status: "Attention",
        message: "Some vitals require attention.",
      };
    }

    return {
      score,
      status: "Critical",
      message: "Immediate medical attention may be required.",
    };
  }, [vitals]);

  const progressWidth =
    score === "--" ? "0%" : `${Math.min(score, 100)}%`;

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Health Score</Text>

      <Text style={styles.score}>{score}</Text>

      <Text style={styles.status}>{status}</Text>

      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            { width: progressWidth },
          ]}
        />
      </View>

      <Text style={styles.message}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 22,
    marginBottom: 18,
    alignItems: "center",
  },

  heading: {
    color: theme.colors.muted,
    fontWeight: "700",
    fontSize: 13,
  },

  score: {
    marginTop: 10,
    fontSize: 52,
    fontWeight: "900",
    color: theme.colors.text,
  },

  status: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.success,
  },

  progressBg: {
    marginTop: 20,
    width: "100%",
    height: 10,
    backgroundColor: theme.colors.chip,
    borderRadius: 100,
    overflow: "hidden",
  },

  progressFill: {
    height: 10,
    backgroundColor: theme.colors.success,
  },

  message: {
    marginTop: 18,
    textAlign: "center",
    color: theme.colors.muted,
    fontWeight: "600",
    lineHeight: 20,
  },
});