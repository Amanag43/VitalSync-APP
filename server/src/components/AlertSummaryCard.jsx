import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";

export default function AlertSummaryCard({
  title,
  value,
  color,
  icon,
}) {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: color + "20",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={color}
        />
      </View>

      <Text style={styles.value}>
        {value}
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  value: {
    marginTop: 18,
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "900",
  },

  title: {
    marginTop: 4,
    color: theme.colors.muted,
    fontWeight: "700",
    fontSize: 13,
  },

});