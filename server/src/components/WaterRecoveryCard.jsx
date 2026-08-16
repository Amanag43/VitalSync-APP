import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";

export default function WaterRecoveryCard({
  waterPercent = 72,
  waterAmount = "1.8L",
  recoveryPercent = 82,
}) {
  return (
    <View style={styles.gridRow}>
      {/* Water Card */}
      <View style={[styles.card, styles.halfCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionLabel}>WATER</Text>
          <Text style={styles.subText}>{waterAmount}</Text>
        </View>

        <View style={styles.waterVisualBox}>
          {/* Animated Water Level Fill */}
          <View style={styles.waterFillBg}>
            <View
              style={[
                styles.waterFillLevel,
                { height: `${waterPercent}%` },
              ]}
            />
          </View>

          <View style={styles.waterCenterContent}>
            <Text style={styles.percentText}>{waterPercent}%</Text>
            <Text style={styles.goalText}>DAILY GOAL</Text>
          </View>
        </View>
      </View>

      {/* Recovery Card */}
      <View style={[styles.card, styles.halfCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionLabel}>RECOVERY</Text>
          <View style={styles.batteryDot} />
        </View>

        <View style={styles.recoveryContent}>
          <View style={styles.energyBadge}>
            <Ionicons name="flash" size={24} color="#000000" />
          </View>
          <Text style={styles.recoveryPercentText}>{recoveryPercent}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: theme.spacing.m,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  halfCard: {
    flex: 1,
    height: 140,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    color: theme.colors.muted,
  },
  subText: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.blue,
  },
  batteryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.amber,
  },
  waterVisualBox: {
    height: 80,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  waterFillBg: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  waterFillLevel: {
    backgroundColor: "rgba(59, 130, 246, 0.65)",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  waterCenterContent: {
    alignItems: "center",
    zIndex: 2,
  },
  percentText: {
    fontSize: 22,
    fontWeight: "900",
    color: theme.colors.text,
  },
  goalText: {
    fontSize: 9,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.8)",
    letterSpacing: 0.8,
  },
  recoveryContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  energyBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.amber,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    ...theme.shadow.glowRose,
  },
  recoveryPercentText: {
    fontSize: 20,
    fontWeight: "900",
    color: theme.colors.text,
  },
});
