import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/theme";

export default function VitalCard({
  icon,
  iconColor = theme.colors.primary,
  title,
  value,
  unit,
  status = "Normal",
  statusColor = theme.colors.success,
  updated = "Just now",
}) {
  return (
    <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: `${iconColor}20`,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={24}
            color={iconColor}
          />
        </View>

        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: statusColor,
            },
          ]}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>
        {title}
      </Text>

      {/* Value */}
      <View style={styles.valueRow}>
        <Text style={styles.value}>
          {value ?? "--"}
        </Text>

        <Text style={styles.unit}>
          {unit}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text
          style={[
            styles.status,
            {
              color: statusColor,
            },
          ]}
        >
          {status}
        </Text>

        <Text style={styles.updated}>
          {updated}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
      width: "48%",
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 18,
      minHeight: 130,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconContainer: {
    width: 48,
    height: 48,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",
  },

  statusDot: {
    width: 12,
    height: 12,

    borderRadius: 100,
  },

  title: {
    marginTop: 18,

    color: theme.colors.textSecondary,

    fontSize: theme.typography.body,

    fontWeight: "600",
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",

    marginTop: 12,
  },

  value: {
    color: theme.colors.text,

    fontSize: 34,

    fontWeight: "800",
  },

  unit: {
    marginLeft: 6,
    marginBottom: 5,

    color: theme.colors.muted,

    fontSize: 15,
  },

  footer: {
    marginTop: "auto",

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  status: {
    fontWeight: "700",

    fontSize: 13,
  },

  updated: {
    color: theme.colors.muted,

    fontSize: 11,
  },
});