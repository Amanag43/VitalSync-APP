import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppScreen from "../../components/AppScreen";
import ActivityRingsCard from "../../components/ActivityRingsCard";
import HeartRateCard from "../../components/HeartRateCard";
import WaterRecoveryCard from "../../components/WaterRecoveryCard";
import LiveStatusCard from "../../components/LiveStatusCard";
import AiHealthCard from "../../components/AiHealthCard";
import { useAuthStore } from "../../store/authStore";
import { useVitalsStore } from "../../store/vitalsStore";
import { theme } from "../../theme/theme";
import { startAlertEngine } from "../../engine/alertEngine";
import { getProfile } from "../../services/apiService";
import {
  initializeHealthConnect,
  requestHealthPermissions,
} from "../../services/healthConnect";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const userId = user?.id ?? user?.uid ?? "user123";
  
  const vitals = useVitalsStore((s) => s.vitals);
  const setUserId = useVitalsStore((s) => s.setUserId);
  const fetchLatestFromBackend = useVitalsStore((s) => s.fetchLatestFromBackend);
  const connectWebSocket = useVitalsStore((s) => s.connectWebSocket);

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).toUpperCase();

  useEffect(() => {
    let intervalId = null;

    async function setupBackendAndHealth() {
      if (!userId) return;
      
      setUserId(userId);
      connectWebSocket(userId);

      // Fetch profile & vitals directly from MongoDB
      try {
        const profRes = await getProfile(userId);
        if (profRes.success && profRes.profile) {
          updateUser(profRes.profile);
        }
      } catch (e) {
        console.log("[Home] Profile sync notice:", e.message);
      }

      await fetchLatestFromBackend(userId);

      try {
        const initialized = await initializeHealthConnect();
        if (initialized) {
          const granted = await requestHealthPermissions();
          if (granted) {
            await startAlertEngine(userId);
          }
        }
      } catch (e) {
        console.log("[Home] Health setup notice:", e.message);
      }
    }

    setupBackendAndHealth();
  }, [userId]);

  const getVal = (item, defaultVal) => {
    if (item === null || item === undefined) return defaultVal;
    if (typeof item === "object") return item.value ?? defaultVal;
    return item;
  };

  const currentHr = getVal(vitals?.heartRate, 75);
  const currentSteps = getVal(vitals?.steps, 5420);

  return (
    <View style={styles.container}>
      <AppScreen style={styles.appScreen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Row */}
          <View style={styles.header}>
            <View>
              <Text style={styles.dateLabel}>{todayStr}</Text>
              <Text style={styles.headerTitle}>HEALTH DASHBOARD</Text>
            </View>

            <Pressable
              onPress={() => router.push("/(app)/settings")}
              style={styles.avatarWrapper}
            >
              <View style={styles.avatarPlaceholder}>
                {user?.photo || user?.avatar ? (
                  <Image source={{ uri: user.photo || user.avatar }} style={styles.headerAvatarImage} />
                ) : (
                  <Ionicons name="person" size={18} color={theme.colors.text} />
                )}
              </View>
              <View style={styles.liveDot} />
            </Pressable>
          </View>

          {/* VitalSync System Connection Banner */}
          <View style={styles.bannerMargin}>
            <LiveStatusCard />
          </View>

          {/* AI Diagnostic Health Assistant Card */}
          <AiHealthCard userId={userId} />

          {/* Activity Concentric Rings Card */}
          <ActivityRingsCard
            move={currentSteps}
            moveGoal={10000}
            exercise={25}
            exerciseGoal={30}
            stand={8}
            standGoal={12}
          />

          {/* Heart Rate Card with Sparkline */}
          <HeartRateCard heartRate={currentHr} status="RESTING" />

          {/* Water & Recovery Dual Card */}
          <WaterRecoveryCard
            waterPercent={72}
            waterAmount="1.8L"
            recoveryPercent={82}
          />

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
  dateLabel: {
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
  avatarWrapper: {
    position: "relative",
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.cardLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  headerAvatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.mint,
    borderWidth: 2,
    borderColor: theme.colors.bg,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  bannerMargin: {
    marginBottom: 16,
  },
});
