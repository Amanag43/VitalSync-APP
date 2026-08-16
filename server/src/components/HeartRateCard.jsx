import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";

export default function HeartRateCard({ heartRate = 78, status = "RESTING" }) {
  // Mock hourly heart rate trend data matching the reference image bars
  const bars = [
    { time: "10:00", val: 55, active: false },
    { time: "10:15", val: 65, active: false },
    { time: "10:30", val: 82, active: true },
    { time: "10:45", val: 74, active: false },
    { time: "11:00", val: 68, active: false },
  ];

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="heart" size={14} color={theme.colors.rose} />
          <Text style={styles.sectionLabel}>HEART RATE</Text>
        </View>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      {/* BPM Value Header */}
      <View style={styles.valueRow}>
        <Text style={styles.bpmValue}>{heartRate}</Text>
        <Text style={styles.bpmUnit}>BPM</Text>
      </View>

      {/* Hourly Bar Sparkline Visual */}
      <View style={styles.chartContainer}>
        <View style={styles.barsRow}>
          {bars.map((item, index) => {
            const heightPct = `${(item.val / 100) * 100}%`;
            return (
              <View key={index} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: heightPct,
                        backgroundColor: item.active
                          ? theme.colors.rose
                          : "rgba(255, 107, 129, 0.35)",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.timeLabel}>{item.time}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.m,
    ...theme.shadow.card,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.1,
    color: theme.colors.muted,
  },
  statusPill: {
    backgroundColor: theme.colors.roseSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.round,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 129, 0.3)",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "900",
    color: theme.colors.rose,
    letterSpacing: 0.8,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginVertical: 12,
  },
  bpmValue: {
    fontSize: 36,
    fontWeight: "900",
    color: theme.colors.text,
  },
  bpmUnit: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.muted,
    letterSpacing: 1,
  },
  chartContainer: {
    marginTop: 4,
  },
  barsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 70,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  barTrack: {
    width: 20,
    height: 48,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 8,
  },
  timeLabel: {
    fontSize: 10,
    color: theme.colors.muted,
    marginTop: 6,
    fontWeight: "700",
  },
});
