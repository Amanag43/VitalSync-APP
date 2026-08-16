import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppScreen from "../../components/AppScreen";
import MilestoneBadges from "../../components/MilestoneBadges";
import { theme } from "../../theme/theme";
import { useAuthStore } from "../../store/authStore";
import { getVitalsHistory } from "../../services/apiService";

export default function Stats() {
  const userId = useAuthStore((s) => s.user?.id ?? s.user?.uid ?? "user123");
  const [selectedPeriod, setSelectedPeriod] = useState("WEEKLY");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const periods = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

  const loadStatsData = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await getVitalsHistory(userId, 100);
      if (res.ok && Array.isArray(res.vitals)) {
        setHistory(res.vitals);
      }
    } catch (e) {
      console.log("[Stats] Error loading history:", e.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadStatsData();
  }, [loadStatsData]);

  const getVal = (item, defaultVal = null) => {
    if (item === null || item === undefined) return defaultVal;
    if (typeof item === "object") return item.value ?? defaultVal;
    return item;
  };

  // Filter history based on selected period
  const periodFilteredHistory = useMemo(() => {
    if (history.length === 0) return [];
    const now = new Date().getTime();

    return history.filter((doc) => {
      if (!doc.timestamp) return true;
      const t = new Date(doc.timestamp).getTime();
      const diffDays = (now - t) / (1000 * 3600 * 24);

      if (selectedPeriod === "DAILY") return diffDays <= 1;
      if (selectedPeriod === "WEEKLY") return diffDays <= 7;
      if (selectedPeriod === "MONTHLY") return diffDays <= 30;
      return true; // YEARLY
    });
  }, [history, selectedPeriod]);

  const avgHeartRate = useMemo(() => {
    const activeData = periodFilteredHistory.length > 0 ? periodFilteredHistory : history;
    if (activeData.length === 0) return 72;
    const hrValues = activeData
      .map((doc) => getVal(doc.vitals?.heartRate))
      .filter((v) => typeof v === "number" && !isNaN(v));
    if (hrValues.length === 0) return 72;
    return Math.round(hrValues.reduce((a, b) => a + b, 0) / hrValues.length);
  }, [history, periodFilteredHistory]);

  const totalSteps = useMemo(() => {
    const activeData = periodFilteredHistory.length > 0 ? periodFilteredHistory : history;
    if (activeData.length === 0) return 5420;
    const latestDoc = activeData[0];
    return getVal(latestDoc.vitals?.steps) || 5420;
  }, [history, periodFilteredHistory]);

  // Compute dynamic bars matching the selected period
  const periodBars = useMemo(() => {
    const activeData = periodFilteredHistory.length > 0 ? periodFilteredHistory : history;

    if (selectedPeriod === "DAILY") {
      const slots = ["04:00", "08:00", "12:00", "16:00", "20:00", "24:00"];
      return slots.map((day, idx) => {
        const doc = activeData[idx];
        const hr = doc ? getVal(doc.vitals?.heartRate) : null;
        const val = hr ? Math.min(100, Math.max(25, Math.round((hr / 150) * 100))) : 40 + (idx * 10) % 45;
        return { day, val, active: idx === slots.length - 1 };
      });
    }

    if (selectedPeriod === "MONTHLY") {
      const slots = ["WK 1", "WK 2", "WK 3", "WK 4"];
      return slots.map((day, idx) => {
        const doc = activeData[idx * 2];
        const hr = doc ? getVal(doc.vitals?.heartRate) : null;
        const val = hr ? Math.min(100, Math.max(30, Math.round((hr / 150) * 100))) : 55 + (idx * 12) % 40;
        return { day, val, active: idx === 3 };
      });
    }

    if (selectedPeriod === "YEARLY") {
      const slots = ["Q1", "Q2", "Q3", "Q4"];
      return slots.map((day, idx) => {
        const doc = activeData[idx * 3];
        const hr = doc ? getVal(doc.vitals?.heartRate) : null;
        const val = hr ? Math.min(100, Math.max(35, Math.round((hr / 150) * 100))) : 60 + (idx * 8) % 35;
        return { day, val, active: idx === 3 };
      });
    }

    // Default WEEKLY
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    return days.map((day, idx) => {
      const doc = activeData[idx];
      const hr = doc ? getVal(doc.vitals?.heartRate) : null;
      const val = hr ? Math.min(100, Math.max(30, Math.round((hr / 160) * 100))) : 50 + (idx * 5) % 35;
      return { day, val, active: idx === 3 };
    });
  }, [history, periodFilteredHistory, selectedPeriod]);

  return (
    <View style={styles.container}>
      <AppScreen style={styles.appScreen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.sectionLabel}>DETAILED ANALYTICS</Text>
              <Text style={styles.headerTitle}>HEALTH STATISTICS</Text>
            </View>

            <Pressable style={styles.iconBtn} onPress={loadStatsData}>
              <Ionicons name="reload-outline" size={16} color={theme.colors.textSecondary} />
            </Pressable>
          </View>

          {/* Time Filter Pills */}
          <View style={styles.filterRow}>
            {periods.map((p) => {
              const isSelected = selectedPeriod === p;
              return (
                <Pressable
                  key={p}
                  onPress={() => setSelectedPeriod(p)}
                  style={[
                    styles.periodPill,
                    isSelected && styles.periodPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.periodText,
                      isSelected && styles.periodTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 30 }} />
          ) : (
            <>
              {/* Active Calories / Steps Card */}
              <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <Text style={styles.cardSubLabel}>STEPS TRACKED ({selectedPeriod})</Text>
                    <View style={styles.caloriesValRow}>
                      <Text style={styles.caloriesVal}>{totalSteps.toLocaleString()}</Text>
                      <Text style={styles.caloriesUnit}>steps</Text>
                      <View style={styles.changeBadge}>
                        <Text style={styles.changeText}>LIVE</Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="flame" size={20} color={theme.colors.rose} />
                </View>

                {/* Dynamic Period Bar Chart */}
                <View style={styles.chartArea}>
                  <View style={styles.barsContainer}>
                    {periodBars.map((b, i) => (
                      <View key={i} style={styles.barCol}>
                        <View style={styles.barTrack}>
                          <View
                            style={[
                              styles.barFill,
                              {
                                height: `${b.val}%`,
                                backgroundColor: b.active
                                  ? theme.colors.rose
                                  : "rgba(255, 107, 129, 0.25)",
                              },
                            ]}
                          />
                        </View>
                        <Text
                          style={[
                            styles.dayText,
                            b.active && { color: theme.colors.text, fontWeight: "900" },
                          ]}
                        >
                          {b.day}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Dual Stat Cards */}
              <View style={styles.dualRow}>
                {/* DB Readings */}
                <View style={[styles.card, styles.halfCard]}>
                  <View style={styles.statHeader}>
                    <Ionicons name="documents-outline" size={14} color={theme.colors.violet} />
                    <Text style={styles.statLabel}>PERIOD READINGS</Text>
                  </View>
                  <Text style={styles.statVal}>{periodFilteredHistory.length} Docs</Text>
                  <View style={styles.sleepLineBg}>
                    <View style={styles.sleepLineFill} />
                  </View>
                </View>

                {/* HR Resting */}
                <View style={[styles.card, styles.halfCard]}>
                  <View style={styles.statHeader}>
                    <Ionicons name="heart-circle" size={14} color={theme.colors.rose} />
                    <Text style={styles.statLabel}>PERIOD AVG HR</Text>
                  </View>
                  <Text style={styles.statVal}>{avgHeartRate} bpm</Text>
                  <View style={styles.statusPillSmall}>
                    <Text style={styles.statusPillSmallText}>{selectedPeriod}</Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Milestones & Achievements */}
          <MilestoneBadges />

          <View style={{ height: 100 }} />
        </ScrollView>
      </AppScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  appScreen: {
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: theme.colors.muted,
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.chip,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: theme.radius.md,
    padding: 4,
    marginBottom: 16,
  },
  periodPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: theme.radius.sm,
  },
  periodPillActive: {
    backgroundColor: theme.colors.cardLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  periodText: {
    fontSize: 10,
    fontWeight: "800",
    color: theme.colors.muted,
    letterSpacing: 0.8,
  },
  periodTextActive: {
    color: theme.colors.text,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.m,
    ...theme.shadow.card,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardSubLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: theme.colors.muted,
    letterSpacing: 1,
  },
  caloriesValRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 4,
  },
  caloriesVal: {
    fontSize: 26,
    fontWeight: "900",
    color: theme.colors.text,
  },
  caloriesUnit: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.muted,
  },
  changeBadge: {
    backgroundColor: theme.colors.mintSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  changeText: {
    fontSize: 10,
    fontWeight: "900",
    color: theme.colors.mint,
  },
  chartArea: {
    marginTop: 8,
  },
  barsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  barTrack: {
    width: 22,
    height: 90,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 8,
  },
  dayText: {
    fontSize: 9,
    fontWeight: "800",
    color: theme.colors.muted,
    marginTop: 8,
  },
  dualRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: theme.spacing.m,
  },
  halfCard: {
    flex: 1,
    marginBottom: 0,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "900",
    color: theme.colors.muted,
    letterSpacing: 0.8,
  },
  statVal: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.text,
    marginBottom: 8,
  },
  sleepLineBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  sleepLineFill: {
    width: "80%",
    height: "100%",
    backgroundColor: theme.colors.violet,
  },
  statusPillSmall: {
    backgroundColor: theme.colors.mintSoft,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statusPillSmallText: {
    fontSize: 8,
    fontWeight: "900",
    color: theme.colors.mint,
  },
});
