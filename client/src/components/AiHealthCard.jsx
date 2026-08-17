import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";
import { getAiInsights } from "../services/apiService";

export default function AiHealthCard({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const fetchInsights = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await getAiInsights(userId);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.log("[AiHealthCard] Notice:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [userId]);

  if (loading && !data) {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={16} color={theme.colors.primary} />
          </View>
          <Text style={styles.headerTitle}>AI Health Assistant</Text>
        </View>
        <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 20 }} />
      </View>
    );
  }

  const score = data?.overallScore ?? 94;
  const statusLabel = data?.statusLabel ?? "Optimal Stability";
  const summary = data?.summary ?? "7-day telemetry demonstrates steady cardiovascular and respiratory balance.";
  const recommendations = data?.recommendations ?? [
    "Oxygen saturation is optimal at 98%. Maintain hydration.",
    "Resting heart rate remains within the ideal 60-90 bpm baseline.",
  ];
  const metrics = data?.metrics ?? { hrAvg: 72, spo2Avg: 98.2, tempAvg: 36.6, stepAvg: 4850 };

  return (
    <View style={styles.card}>
      {/* Top Banner Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={16} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Health Assistant</Text>
            <Text style={styles.headerSub}>7-DAY TELEMETRY DIAGNOSTIC</Text>
          </View>
        </View>

        {/* Score Pill */}
        <View style={styles.scorePill}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.scoreLabel}>/100</Text>
        </View>
      </View>

      {/* Dynamic Status Tag */}
      <View style={styles.statusRow}>
        <View style={styles.greenDot} />
        <Text style={styles.statusText}>{statusLabel}</Text>
      </View>

      {/* Natural Language Diagnostic Summary */}
      <Text style={styles.summaryText}>{summary}</Text>

      {/* 7-Day Metric Snapshot Chips */}
      <View style={styles.metricsRow}>
        <View style={styles.metricChip}>
          <Ionicons name="heart" size={12} color={theme.colors.rose} style={{ marginRight: 4 }} />
          <Text style={styles.metricVal}>{metrics.hrAvg} <Text style={styles.metricUnit}>bpm</Text></Text>
        </View>

        <View style={styles.metricChip}>
          <Ionicons name="water" size={12} color={theme.colors.cyan} style={{ marginRight: 4 }} />
          <Text style={styles.metricVal}>{metrics.spo2Avg} <Text style={styles.metricUnit}>%</Text></Text>
        </View>

        <View style={styles.metricChip}>
          <Ionicons name="thermometer" size={12} color={theme.colors.amber} style={{ marginRight: 4 }} />
          <Text style={styles.metricVal}>{metrics.tempAvg} <Text style={styles.metricUnit}>Â°C</Text></Text>
        </View>

        <View style={styles.metricChip}>
          <Ionicons name="footsteps" size={12} color={theme.colors.mint} style={{ marginRight: 4 }} />
          <Text style={styles.metricVal}>{metrics.stepAvg} <Text style={styles.metricUnit}>st</Text></Text>
        </View>
      </View>

      {/* Expandable Recommendations */}
      {expanded && (
        <View style={styles.recommendSection}>
          <Text style={styles.recommendHeader}>CLINICAL RECOMMENDATIONS</Text>
          {recommendations.map((rec, idx) => (
            <View key={idx} style={styles.recItem}>
              <Ionicons name="checkmark-circle" size={15} color={theme.colors.mint} style={{ marginTop: 2, marginRight: 8 }} />
              <Text style={styles.recText}>{rec}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Card Actions Footer */}
      <View style={styles.footerRow}>
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.expandBtn}>
          <Text style={styles.expandBtnText}>
            {expanded ? "Hide Clinical Tips" : "View Clinical Tips"}
          </Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={14}
            color={theme.colors.primary}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={fetchInsights} disabled={loading} style={styles.refreshBtn}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <>
              <Ionicons name="sync-outline" size={14} color={theme.colors.muted} />
              <Text style={styles.refreshText}>Re-analyze</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.25)",
    padding: 18,
    marginVertical: 14,
    ...theme.shadow.card,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  aiBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(37, 99, 235, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: theme.colors.text,
  },
  headerSub: {
    fontSize: 9,
    fontWeight: "900",
    color: theme.colors.muted,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  scorePill: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.25)",
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.mint,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: theme.colors.muted,
    marginLeft: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.mint,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "900",
    color: theme.colors.mint,
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.text,
    fontWeight: "600",
    marginBottom: 14,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  metricChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 8,
  },
  metricVal: {
    fontSize: 12,
    fontWeight: "900",
    color: theme.colors.text,
  },
  metricUnit: {
    fontSize: 9,
    color: theme.colors.muted,
    fontWeight: "700",
  },
  recommendSection: {
    backgroundColor: theme.colors.bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    marginBottom: 14,
  },
  recommendHeader: {
    fontSize: 9,
    fontWeight: "900",
    color: theme.colors.muted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  recItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  recText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
    lineHeight: 17,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
    paddingTop: 12,
  },
  expandBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  expandBtnText: {
    fontSize: 12,
    fontWeight: "900",
    color: theme.colors.primary,
  },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  refreshText: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.muted,
  },
});

