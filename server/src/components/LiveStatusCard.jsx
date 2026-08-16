import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useVitalsStore } from "../store/vitalsStore";
import { theme } from "../theme/theme";

export default function LiveStatusCard() {
  const syncing = useVitalsStore((s) => s.syncing);
  const lastSync = useVitalsStore((s) => s.lastSync);
  const wsConnected = useVitalsStore((s) => s.wsConnected);
  const vitals = useVitalsStore((s) => s.vitals);

  const isConnected = wsConnected || Boolean(vitals);

  return (
    <View style={styles.card}>
      <View style={styles.row}>

        <View
          style={[
            styles.dot,
            {
              backgroundColor: isConnected
                ? theme.colors.success
                : theme.colors.danger,
            },
          ]}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {isConnected
              ? "Connected to VitalSync Server"
              : "Disconnected"}
          </Text>

          <Text style={styles.subtitle}>
            {syncing
              ? "Syncing..."
              : lastSync
              ? `Last Sync: ${new Date(lastSync).toLocaleTimeString()}`
              : isConnected
              ? "Live Telemetry Active"
              : "Waiting for first sync"}
          </Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    marginTop: 18,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 14,
  },

  title: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 15,
  },

  subtitle: {
    marginTop: 4,
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
});