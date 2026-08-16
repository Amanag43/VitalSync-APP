import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import AppScreen from "../../components/AppScreen";
import TimeFilter from "../../components/TimeFilter";
import TrendChartCard from "../../components/TrendChartCard";
import { useAuthStore } from "../../store/authStore";
import { theme } from "../../theme/theme";
import { getVitalsHistory } from "../../services/apiService";

export default function HealthTrends() {
  const profile = useAuthStore((s) => s.user);
  const userId = profile?.id ?? profile?.uid ?? "user123";
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await getVitalsHistory(userId, 50);
      if (res.ok && Array.isArray(res.vitals)) {
        setHistory(res.vitals);
      }
    } catch (e) {
      console.log("[HealthTrends] Error loading history:", e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const getVal = (item, defaultVal = null) => {
    if (item === null || item === undefined) return defaultVal;
    if (typeof item === "object") return item.value ?? defaultVal;
    return item;
  };

  const computeVitalStats = (vitalKey, fallbackVal = 70) => {
    if (history.length === 0) {
      return {
        current: fallbackVal,
        avg: fallbackVal,
        min: fallbackVal - 5,
        max: fallbackVal + 10,
        points: [fallbackVal - 4, fallbackVal, fallbackVal + 2, fallbackVal - 1, fallbackVal + 5],
      };
    }

    const rawList = history
      .map((doc) => getVal(doc.vitals?.[vitalKey]))
      .filter((v) => typeof v === "number" && !isNaN(v));

    if (rawList.length === 0) {
      return {
        current: fallbackVal,
        avg: fallbackVal,
        min: fallbackVal - 5,
        max: fallbackVal + 10,
        points: [fallbackVal - 4, fallbackVal, fallbackVal + 2, fallbackVal - 1, fallbackVal + 5],
      };
    }

    const points = [...rawList].reverse();
    const current = points[points.length - 1];
    const min = Math.min(...points);
    const max = Math.max(...points);
    const avg = Math.round(points.reduce((a, b) => a + b, 0) / points.length);

    return { current, avg, min, max, points };
  };

  const hrStats = useMemo(() => computeVitalStats("heartRate", 76), [history]);
  const spo2Stats = useMemo(() => computeVitalStats("spo2", 98), [history]);
  const tempStats = useMemo(() => computeVitalStats("bodyTemp", 36.8), [history]);
  const rrStats = useMemo(() => computeVitalStats("respiratoryRate", 16), [history]);
  const stepsStats = useMemo(() => computeVitalStats("steps", 5420), [history]);

  return (
    <AppScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.title}>
          {profile?.fullName ? `${profile.fullName}'s Health Telemetry` : "Live Health Trends"}
        </Text>

        <Text style={styles.profileContext}>
          {profile?.bloodGroup ? `Blood Group: ${profile.bloodGroup} • ${history.length} database readings synced` : `${history.length} database readings synced`}
        </Text>

        <TimeFilter />

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 40 }} />
        ) : (
          <View style={{ marginTop: 16 }}>
            {/* 1. Heart Rate Graph */}
            <TrendChartCard
              title="Heart Rate"
              icon="heart"
              iconColor="#EF4444"
              current={hrStats.current.toString()}
              average={hrStats.avg.toString()}
              minimum={hrStats.min.toString()}
              maximum={hrStats.max.toString()}
              unit="bpm"
              dataPoints={hrStats.points}
            />

            {/* 2. SpO2 Oxygen Graph */}
            <TrendChartCard
              title="Blood Oxygen (SpO₂)"
              icon="water"
              iconColor="#06B6D4"
              current={spo2Stats.current.toString()}
              average={spo2Stats.avg.toString()}
              minimum={spo2Stats.min.toString()}
              maximum={spo2Stats.max.toString()}
              unit="%"
              dataPoints={spo2Stats.points}
            />

            {/* 3. Body Temperature Graph */}
            <TrendChartCard
              title="Body Temperature"
              icon="thermometer"
              iconColor="#F59E0B"
              current={tempStats.current.toString()}
              average={tempStats.avg.toString()}
              minimum={tempStats.min.toString()}
              maximum={tempStats.max.toString()}
              unit="°C"
              dataPoints={tempStats.points}
            />

            {/* 4. Respiratory Rate Graph */}
            <TrendChartCard
              title="Respiratory Rate"
              icon="fitness"
              iconColor="#6366F1"
              current={rrStats.current.toString()}
              average={rrStats.avg.toString()}
              minimum={rrStats.min.toString()}
              maximum={rrStats.max.toString()}
              unit="rpm"
              dataPoints={rrStats.points}
            />

            {/* 5. Daily Steps Graph */}
            <TrendChartCard
              title="Daily Steps"
              icon="walk"
              iconColor="#A855F7"
              current={stepsStats.current.toLocaleString()}
              average={stepsStats.avg.toLocaleString()}
              minimum={stepsStats.min.toLocaleString()}
              maximum={stepsStats.max.toLocaleString()}
              unit="steps"
              dataPoints={stepsStats.points}
            />
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "white",
    marginBottom: 6,
  },
  profileContext: {
    color: "#94A3B8",
    marginBottom: 18,
    fontSize: 13,
    fontWeight: "600",
  },
});
