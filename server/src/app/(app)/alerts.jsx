import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Pressable,
  Alert as RNAlert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppScreen from "../../components/AppScreen";
import AlertSummaryCard from "../../components/AlertSummaryCard";
import AlertCard from "../../components/AlertCard";
import AlertFilter from "../../components/AlertFilter";
import { theme } from "../../theme/theme";
import { useAuthStore } from "../../store/authStore";
import { getAlerts, resolveAlertApi } from "../../services/apiService";

export default function AlertsScreen() {
  const userId = useAuthStore((s) => s.user?.id ?? s.user?.uid ?? "user123");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("All");
  const [activeAlertDetail, setActiveAlertDetail] = useState(null);
  const [resolving, setResolving] = useState(false);

  const fetchAlertHistory = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getAlerts(userId);
      if (Array.isArray(data?.alerts)) {
        setAlerts(data.alerts);
      } else if (Array.isArray(data)) {
        setAlerts(data);
      }
    } catch (e) {
      console.log("[AlertsScreen] Notice fetching alerts:", e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAlertHistory();
  }, [fetchAlertHistory]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAlertHistory();
  };

  const handleResolveAlert = async (alertId) => {
    setResolving(true);
    try {
      const res = await resolveAlertApi(alertId);
      if (res.success) {
        setActiveAlertDetail(null);
        fetchAlertHistory();
      }
    } catch (e) {
      RNAlert.alert("Error", e.message || "Could not resolve alert.");
    } finally {
      setResolving(false);
    }
  };

  const criticalCount = useMemo(() => {
    return alerts.filter((a) => a.severity === "critical" && a.status !== "resolved").length;
  }, [alerts]);

  const warningCount = useMemo(() => {
    return alerts.filter((a) => a.severity === "warning" && a.status !== "resolved").length;
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    if (filter === "All") return alerts;
    if (filter === "Critical") return alerts.filter((item) => item.severity === "critical");
    if (filter === "Warning") return alerts.filter((item) => item.severity === "warning");
    if (filter === "Resolved") return alerts.filter((item) => item.status === "resolved");
    return alerts;
  }, [alerts, filter]);

  return (
    <AppScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.title}>Incident Log</Text>
        <Text style={styles.subtitle}>
          Emergency triggers & telemetry threshold alerts from VitalSync
        </Text>

        <View style={styles.summaryRow}>
          <AlertSummaryCard
            title="Critical Active"
            value={criticalCount.toString()}
            color="#EF4444"
            icon="warning"
          />
          <View style={{ width: 12 }} />
          <AlertSummaryCard
            title="Warnings Active"
            value={warningCount.toString()}
            color="#F59E0B"
            icon="alert-circle"
          />
        </View>

        <View style={{ marginVertical: 16 }}>
          <AlertFilter selected={filter} onSelect={setFilter} />
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: 24 }}
          />
        ) : filteredAlerts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🛡️</Text>
            <Text style={styles.emptyTitle}>No Incidents Recorded</Text>
            <Text style={styles.emptyText}>
              {filter === "All"
                ? "Your vitals are stable. Emergency alerts will automatically log here."
                : `No ${filter} incidents found in your database.`}
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: 12 }}>
            {filteredAlerts.map((item, index) => (
              <AlertCard
                key={item._id || index}
                alert={item}
                onPress={(selected) => setActiveAlertDetail(selected)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* High-End Glassmorphism Alert Detail Dialog Modal */}
      <Modal
        visible={!!activeAlertDetail}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveAlertDetail(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setActiveAlertDetail(null)} />
          {activeAlertDetail && (
            <View style={styles.modalDialog}>
              <View
                style={[
                  styles.modalIconRing,
                  {
                    backgroundColor:
                      activeAlertDetail.status === "resolved"
                        ? "rgba(16, 185, 129, 0.15)"
                        : activeAlertDetail.severity === "critical"
                        ? "rgba(239, 68, 68, 0.15)"
                        : "rgba(245, 158, 11, 0.15)",
                  },
                ]}
              >
                <Ionicons
                  name={activeAlertDetail.status === "resolved" ? "checkmark-circle" : "warning"}
                  size={42}
                  color={
                    activeAlertDetail.status === "resolved"
                      ? theme.colors.mint
                      : activeAlertDetail.severity === "critical"
                      ? theme.colors.danger
                      : "#F59E0B"
                  }
                />
              </View>

              <Text style={styles.modalVitalName}>{activeAlertDetail.vital || "Abnormal Vital Trigger"}</Text>
              
              <View style={styles.modalValPill}>
                <Text style={styles.modalValText}>
                  {activeAlertDetail.value} {activeAlertDetail.unit || ""}
                </Text>
              </View>

              <View style={styles.modalDetailsList}>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>INCIDENT STATUS</Text>
                  <Text
                    style={[
                      styles.modalDetailVal,
                      {
                        color:
                          activeAlertDetail.status === "resolved"
                            ? theme.colors.mint
                            : theme.colors.danger,
                      },
                    ]}
                  >
                    {activeAlertDetail.status === "resolved" ? "RESOLVED & LOGGED" : "ACTIVE INCIDENT"}
                  </Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>TIME RECORDED</Text>
                  <Text style={styles.modalDetailVal}>
                    {new Date(activeAlertDetail.createdAt || activeAlertDetail.timestamp).toLocaleString()}
                  </Text>
                </View>

                {activeAlertDetail.hospital?.name && (
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>EMERGENCY FACILITY</Text>
                    <Text style={styles.modalDetailVal}>🏥 {activeAlertDetail.hospital.name}</Text>
                  </View>
                )}
              </View>

              {activeAlertDetail.status !== "resolved" ? (
                <Pressable
                  style={styles.modalResolveBtn}
                  onPress={() => handleResolveAlert(activeAlertDetail._id)}
                  disabled={resolving}
                >
                  {resolving ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-done" size={20} color="white" style={{ marginRight: 8 }} />
                      <Text style={styles.modalResolveBtnText}>MARK INCIDENT AS RESOLVED</Text>
                    </>
                  )}
                </Pressable>
              ) : (
                <View style={styles.modalResolvedBadge}>
                  <Ionicons name="shield-checkmark" size={18} color={theme.colors.mint} style={{ marginRight: 6 }} />
                  <Text style={styles.modalResolvedBadgeText}>Incident Resolved & Archived</Text>
                </View>
              )}

              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setActiveAlertDetail(null)}
              >
                <Text style={styles.modalCloseBtnText}>Close Dialog</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 22,
    color: theme.colors.muted,
    fontWeight: "700",
    fontSize: 13,
  },
  summaryRow: {
    flexDirection: "row",
  },
  emptyBox: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 12,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: theme.colors.text,
    marginBottom: 4,
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
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
  modalDialog: {
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
  modalIconRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalVitalName: {
    fontSize: 20,
    fontWeight: "900",
    color: theme.colors.text,
    textAlign: "center",
  },
  modalValPill: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  modalValText: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.text,
  },
  modalDetailsList: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  modalDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  modalDetailLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: theme.colors.muted,
    letterSpacing: 0.8,
  },
  modalDetailVal: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.text,
  },
  modalResolveBtn: {
    width: "100%",
    height: 54,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  modalResolveBtnText: {
    color: "white",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 0.8,
  },
  modalResolvedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  modalResolvedBadgeText: {
    color: theme.colors.mint,
    fontWeight: "900",
    fontSize: 13,
  },
  modalCloseBtn: {
    paddingVertical: 10,
  },
  modalCloseBtnText: {
    color: theme.colors.muted,
    fontWeight: "800",
    fontSize: 13,
  },
});