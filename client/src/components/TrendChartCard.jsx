import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Polyline, Line } from "react-native-svg";
import { theme } from "../theme/theme";

export default function TrendChartCard({
  title,
  unit,
  icon = "analytics",
  iconColor = theme.colors.primary,
  current = "--",
  average = "--",
  minimum = "--",
  maximum = "--",
  dataPoints = [],
}) {
  const chartWidth = 280;
  const chartHeight = 100;

  const validPoints = Array.isArray(dataPoints) && dataPoints.length > 0
    ? dataPoints.map(n => Number(n)).filter(n => !isNaN(n))
    : [60, 68, 75, 70, 82, 78, 88];

  const minVal = Math.min(...validPoints);
  const maxVal = Math.max(...validPoints);
  const range = maxVal - minVal || 1;

  const polylinePoints = validPoints
    .map((val, idx) => {
      const x = (idx / (validPoints.length - 1 || 1)) * (chartWidth - 20) + 10;
      const y = chartHeight - 15 - ((val - minVal) / range) * (chartHeight - 30);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.left}>
          <View style={[styles.iconBox, { backgroundColor: `${iconColor}20` }]}>
            <Ionicons name={icon} size={22} color={iconColor} />
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.current}>
              {current} <Text style={styles.unit}>{unit}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* SVG Line Graph */}
      <View style={styles.chartBox}>
        <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <Line
            x1="0"
            y1={chartHeight / 2}
            x2={chartWidth}
            y2={chartHeight / 2}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="4,4"
          />
          <Polyline
            fill="none"
            stroke={iconColor}
            strokeWidth="3"
            points={polylinePoints}
          />
        </Svg>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.label}>Avg</Text>
          <Text style={styles.value}>{average}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.label}>Min</Text>
          <Text style={styles.value}>{minimum}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.label}>Max</Text>
          <Text style={styles.value}>{maximum}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    marginBottom: 20,
    ...theme.shadow.card,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  title: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  current: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 28,
    marginTop: 2,
  },
  unit: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: "700",
  },
  chartBox: {
    marginTop: 16,
    height: 100,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    paddingHorizontal: 8,
  },
  stats: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    paddingTop: 12,
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  value: {
    color: theme.colors.text,
    fontWeight: "900",
    marginTop: 4,
    fontSize: 15,
  },
});
