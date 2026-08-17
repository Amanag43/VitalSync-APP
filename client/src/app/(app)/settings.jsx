import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AppScreen from "../../components/AppScreen";
import { useAuthStore } from "../../store/authStore";
import { theme } from "../../theme/theme";
import SettingsSection from "../../components/SettingsSection";
import SettingsItem from "../../components/SettingsItem";
import { calculateAge } from "../../utils/dateUtils";

export default function Settings() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const user = useAuthStore((s) => s.user);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  const userName = user?.fullName || user?.name || "Patient Profile";
  const heightVal = user?.height ? `${user.height} cm` : "--";
  const weightVal = user?.weight ? `${user.weight} kg` : "--";
  const ageVal = calculateAge(user?.dob);
  const avatarUri = user?.photo || user?.avatar || null;

  const handleLogout = async () => {
    try {
      await clearAuth();
      router.replace("/(auth)/login");
    } catch (_error) {
      Alert.alert("Logout Failed", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <AppScreen style={styles.appScreen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top User Profile Header */}
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={() => router.push("/edit-profile")} style={styles.avatarLarge}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={32} color={theme.colors.text} />
              )}
              <View style={styles.cameraIconBadge}>
                <Ionicons name="camera" size={10} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <Text style={styles.profileName}>{userName}</Text>
            <View style={styles.premiumPill}>
              <Text style={styles.premiumText}>VITALSYNC HEALTH SUITE</Text>
            </View>

            {/* Body Stats Grid */}
            <View style={styles.bodyStatsGrid}>
              <View style={styles.bodyStatItem}>
                <Text style={styles.bodyStatVal}>{weightVal}</Text>
                <Text style={styles.bodyStatLabel}>WEIGHT</Text>
              </View>
              <View style={styles.bodyStatDivider} />
              <View style={styles.bodyStatItem}>
                <Text style={styles.bodyStatVal}>{heightVal}</Text>
                <Text style={styles.bodyStatLabel}>HEIGHT</Text>
              </View>
              <View style={styles.bodyStatDivider} />
              <View style={styles.bodyStatItem}>
                <Text style={styles.bodyStatVal}>{ageVal} {ageVal !== "--" ? "yrs" : ""}</Text>
                <Text style={styles.bodyStatLabel}>AGE</Text>
              </View>
            </View>
          </View>

          {/* ACTIVE HEALTH GOALS Card */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>HEALTH TARGETS</Text>

            <View style={styles.goalsList}>
              <View style={styles.goalRow}>
                <View style={styles.goalTitleGroup}>
                  <Ionicons name="walk-outline" size={18} color={theme.colors.amber} />
                  <Text style={styles.goalName}>DAILY STEPS</Text>
                </View>
                <Text style={styles.goalTarget}>
                  10,000 <Text style={styles.goalUnit}>/ day</Text>
                </Text>
              </View>

              <View style={styles.goalRow}>
                <View style={styles.goalTitleGroup}>
                  <Ionicons name="heart-outline" size={18} color={theme.colors.rose} />
                  <Text style={styles.goalName}>TARGET HR</Text>
                </View>
                <Text style={styles.goalTarget}>
                  45 - 130 <Text style={styles.goalUnit}>bpm</Text>
                </Text>
              </View>

              <View style={styles.goalRow}>
                <View style={styles.goalTitleGroup}>
                  <Ionicons name="fitness-outline" size={18} color={theme.colors.cyan || "#06b6d4"} />
                  <Text style={styles.goalName}>SPO2 TARGET</Text>
                </View>
                <Text style={styles.goalTarget}>
                  &gt; 92% <Text style={styles.goalUnit}>SpO2</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* SYSTEM & SECURITY Card */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>SYSTEM & SECURITY</Text>

            <View style={styles.settingsList}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => Alert.alert("Device Sync", "Phone Sensors & Smartwatch Active")}
              >
                <View style={styles.goalTitleGroup}>
                  <Ionicons name="watch-outline" size={18} color={theme.colors.textSecondary} />
                  <Text style={styles.settingTitle}>TELEMETRY STREAM</Text>
                </View>
                <View style={styles.statusGroup}>
                  <Text style={styles.connectedPillText}>ACTIVE</Text>
                  <Ionicons name="chevron-forward" size={14} color={theme.colors.muted} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => router.push("/edit-profile")}
              >
                <View style={styles.goalTitleGroup}>
                  <Ionicons name="person-outline" size={18} color={theme.colors.textSecondary} />
                  <Text style={styles.settingTitle}>EDIT HEALTH PROFILE</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={theme.colors.muted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => setPrivacyModalVisible(true)}
              >
                <View style={styles.goalTitleGroup}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.textSecondary} />
                  <Text style={styles.settingTitle}>PRIVACY & DATA SECURITY</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={theme.colors.muted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Extended System Settings */}
          <SettingsSection title="Account & Safety">
            <SettingsItem
              icon="people-outline"
              iconColor={theme.colors.amber}
              title="Emergency Contacts"
              subtitle="Manage SOS notification contacts"
              onPress={() => router.push("/emergency-contacts")}
            />
            <SettingsItem
              icon="log-out-outline"
              iconColor={theme.colors.rose}
              title="Logout"
              subtitle="Sign out from your account"
              danger
              onPress={() =>
                Alert.alert("Logout", "Are you sure you want to logout?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Logout", style: "destructive", onPress: handleLogout },
                ])
              }
            />
          </SettingsSection>

          <View style={{ height: 100 }} />
        </ScrollView>
      </AppScreen>

      {/* High-End Privacy & Security Custom Modal */}
      <Modal
        visible={privacyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setPrivacyModalVisible(false)} />
          <View style={styles.privacyDialog}>
            <View style={styles.privacyShieldBox}>
              <Ionicons name="shield-checkmark" size={38} color={theme.colors.mint} />
            </View>

            <Text style={styles.privacyTitle}>PRIVACY & DATA SECURITY</Text>

            <View style={styles.badgeRow}>
              <View style={styles.complianceBadge}>
                <Text style={styles.complianceBadgeText}>HIPAA COMPLIANT</Text>
              </View>
              <View style={[styles.complianceBadge, { backgroundColor: "rgba(37, 99, 235, 0.15)" }]}>
                <Text style={[styles.complianceBadgeText, { color: "#3B82F6" }]}>AES-256 ENCRYPTED</Text>
              </View>
            </View>

            <ScrollView style={{ maxHeight: 220, width: "100%", marginVertical: 12 }}>
              <View style={styles.policyItem}>
                <Ionicons name="lock-closed-outline" size={16} color={theme.colors.mint} style={{ marginTop: 2 }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.policyTitle}>End-to-End Health Telemetry</Text>
                  <Text style={styles.policySub}>
                    Your continuous vitals & biometric telemetry are encrypted in-transit and at rest using bank-grade AES-256.
                  </Text>
                </View>
              </View>

              <View style={styles.policyItem}>
                <Ionicons name="alert-circle-outline" size={16} color={theme.colors.rose} style={{ marginTop: 2 }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.policyTitle}>Emergency Contact Sharing</Text>
                  <Text style={styles.policySub}>
                    GPS location & vital alerts are shared ONLY with your designated emergency contacts during active SOS triggers.
                  </Text>
                </View>
              </View>

              <View style={styles.policyItem}>
                <Ionicons name="trash-bin-outline" size={16} color={theme.colors.amber} style={{ marginTop: 2 }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.policyTitle}>Automatic Data Retention</Text>
                  <Text style={styles.policySub}>
                    Raw biometric telemetry streams are automatically pruned after 90 days. We never sell patient data.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.privacyAgreeBtn}
              onPress={() => setPrivacyModalVisible(false)}
            >
              <Text style={styles.privacyAgreeBtnText}>AGREE & CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  profileSection: {
    alignItems: "center",
    marginVertical: 16,
  },
  avatarLarge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: theme.colors.cardLight,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 10,
    overflow: "visible",
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  cameraIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.rose,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: -2,
    right: -2,
    borderWidth: 2,
    borderColor: theme.colors.bg,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  premiumPill: {
    marginTop: 4,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.round,
  },
  premiumText: {
    fontSize: 9,
    fontWeight: "900",
    color: theme.colors.muted,
    letterSpacing: 1,
  },
  bodyStatsGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  bodyStatItem: {
    alignItems: "center",
  },
  bodyStatVal: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.text,
  },
  bodyStatLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: theme.colors.muted,
    marginTop: 2,
    letterSpacing: 0.8,
  },
  bodyStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.m,
    ...theme.shadow.card,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.1,
    color: theme.colors.muted,
    marginBottom: 12,
  },
  goalsList: {
    gap: 14,
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  goalTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  goalName: {
    fontSize: 11,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: 0.8,
  },
  goalTarget: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.text,
  },
  goalUnit: {
    fontSize: 11,
    color: theme.colors.muted,
  },
  settingsList: {
    gap: 10,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  settingTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: 0.8,
  },
  statusGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  connectedPillText: {
    fontSize: 10,
    fontWeight: "900",
    color: theme.colors.mint,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(5, 8, 15, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  privacyDialog: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: theme.colors.card,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    ...theme.shadow.card,
  },
  privacyShieldBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: 0.8,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 12,
  },
  complianceBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  complianceBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: theme.colors.mint,
    letterSpacing: 0.5,
  },
  policyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  policyTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.text,
  },
  policySub: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 2,
    lineHeight: 16,
  },
  privacyAgreeBtn: {
    width: "100%",
    height: 52,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  privacyAgreeBtnText: {
    color: "white",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 0.8,
  },
});

