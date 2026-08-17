import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";

export default function ActivityRingsCard({
  move = 450,
  moveGoal = 600,
  exercise = 25,
  exerciseGoal = 30,
  stand = 8,
  standGoal = 12,
}) {
  const movePct = Math.min(1, move / moveGoal);
  const exercisePct = Math.min(1, exercise / exerciseGoal);
  const standPct = Math.min(1, stand / standGoal);

  // Circle dimensions
  const size = 120;
  const strokeWidth = 10;
  const center = size / 2;

  const rMove = center - strokeWidth;
  const cMove = 2 * Math.PI * rMove;

  const rExercise = rMove - strokeWidth - 3;
  const cExercise = 2 * Math.PI * rExercise;

  const rStand = rExercise - strokeWidth - 3;
  const cStand = 2 * Math.PI * rStand;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionLabel}>ACTIVITY</Text>
          <Text style={styles.title}>Rings Closed</Text>
        </View>
        <View style={styles.badgeBtn}>
          <Ionicons name="bar-chart" size={16} color={theme.colors.textSecondary} />
        </View>
      </View>

      <View style={styles.bodyRow}>
        {/* Concentric Rings Visual */}
        <View style={styles.svgContainer}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Move Track & Progress */}
            <Circle
              cx={center}
              cy={center}
              r={rMove}
              stroke="rgba(255, 107, 129, 0.15)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={center}
              cy={center}
              r={rMove}
              stroke={theme.colors.rose}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={cMove}
              strokeDashoffset={cMove * (1 - movePct)}
              strokeLinecap="round"
              rotation="-90"
              origin={`${center}, ${center}`}
            />

            {/* Exercise Track & Progress */}
            <Circle
              cx={center}
              cy={center}
              r={rExercise}
              stroke="rgba(32, 201, 151, 0.15)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={center}
              cy={center}
              r={rExercise}
              stroke={theme.colors.mint}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={cExercise}
              strokeDashoffset={cExercise * (1 - exercisePct)}
              strokeLinecap="round"
              rotation="-90"
              origin={`${center}, ${center}`}
            />

            {/* Stand Track & Progress */}
            <Circle
              cx={center}
              cy={center}
              r={rStand}
              stroke="rgba(108, 92, 231, 0.15)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={center}
              cy={center}
              r={rStand}
              stroke={theme.colors.violet}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={cStand}
              strokeDashoffset={cStand * (1 - standPct)}
              strokeLinecap="round"
              rotation="-90"
              origin={`${center}, ${center}`}
            />
          </Svg>
        </View>

        {/* Breakdown Items */}
        <View style={styles.metricsContainer}>
          {/* Move Metric */}
          <View style={styles.metricRow}>
            <View style={styles.labelGroup}>
              <Text style={[styles.metricName, { color: theme.colors.rose }]}>MOVE</Text>
            </View>
            <View style={styles.barWrapper}>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${movePct * 100}%`, backgroundColor: theme.colors.rose },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>
                {move}/{moveGoal} <Text style={styles.unitText}>kcal</Text>
              </Text>
            </View>
          </View>

          {/* Exercise Metric */}
          <View style={styles.metricRow}>
            <View style={styles.labelGroup}>
              <Text style={[styles.metricName, { color: theme.colors.mint }]}>EXERCISE</Text>
            </View>
            <View style={styles.barWrapper}>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${exercisePct * 100}%`, backgroundColor: theme.colors.mint },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>
                {exercise}/{exerciseGoal} <Text style={styles.unitText}>min</Text>
              </Text>
            </View>
          </View>

          {/* Stand Metric */}
          <View style={styles.metricRow}>
            <View style={styles.labelGroup}>
              <Text style={[styles.metricName, { color: theme.colors.violet }]}>STAND</Text>
            </View>
            <View style={styles.barWrapper}>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${standPct * 100}%`, backgroundColor: theme.colors.violet },
                  ]}
                />
              </View>
              <Text style={styles.metricValue}>
                {stand}/{standGoal} <Text style={styles.unitText}>hrs</Text>
              </Text>
            </View>
          </View>
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
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: theme.colors.muted,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
    marginTop: 2,
  },
  badgeBtn: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.chip,
    alignItems: "center",
    justifyContent: "center",
  },
  bodyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  svgContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  metricsContainer: {
    flex: 1,
    gap: 10,
  },
  metricRow: {
    gap: 4,
  },
  labelGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricName: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  barWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  barBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.text,
  },
  unitText: {
    fontSize: 10,
    color: theme.colors.muted,
  },
});
