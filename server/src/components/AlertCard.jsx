import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/theme";

export default function AlertCard({ alert, onPress }) {
  const isResolved = alert.status === "resolved";

  const severityColor = isResolved
    ? theme.colors.mint
    : alert.severity === "critical"
    ? theme.colors.danger
    : "#F59E0B";

  const severityBg = isResolved
    ? "rgba(16,185,129,0.12)"
    : alert.severity === "critical"
    ? theme.colors.dangerSoft
    : "rgba(245,158,11,0.12)";

  function formatAlertDate(dateInput) {
    if (!dateInput) return "Just now";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "Recently";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const formattedDate = formatAlertDate(alert.createdAt || alert.timestamp);

  return (
    <Pressable style={styles.card} onPress={() => onPress?.(alert)}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: severityBg }]}>
          <Ionicons
            name={isResolved ? "checkmark-circle" : "warning"}
            size={24}
            color={severityColor}
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.topRow}>
            <Text style={styles.title}>{alert.vital || "Vital Alert"}</Text>

            <View style={[styles.badge, { backgroundColor: severityBg }]}>
              <Text style={[styles.badgeText, { color: severityColor }]}>
                {isResolved ? "RESOLVED" : alert.severity ? alert.severity.toUpperCase() : "ALERT"}
              </Text>
            </View>
          </View>

          {alert.value !== undefined && (
            <Text style={styles.value}>
              {alert.value} {alert.unit || ""}
            </Text>
          )}

          <Text style={styles.time}>{formattedDate}</Text>

          {alert.hospital?.name && (
            <Text style={styles.hospitalText}>🏥 Assigned: {alert.hospital.name}</Text>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons
            name={isResolved ? "checkmark-done" : "paper-plane"}
            size={16}
            color={isResolved ? theme.colors.mint : theme.colors.success}
          />
          <Text style={[styles.footerText, { color: isResolved ? theme.colors.mint : theme.colors.success }]}>
            {isResolved ? "Resolved & Logged" : alert.sosSent ? "SOS Dispatched" : "Incident Recorded"}
          </Text>
        </View>

        <View style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>{isResolved ? "Details" : "Tap to Resolve"}</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.muted} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    marginBottom: 14,
    ...theme.shadow.card,
  },
  row: {
    flexDirection: "row",
    gap: 14,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 15,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  value: {
    marginTop: 6,
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 22,
  },
  time: {
    marginTop: 4,
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  hospitalText: {
    marginTop: 4,
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  footer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontWeight: "800",
    fontSize: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionBtnText: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
});