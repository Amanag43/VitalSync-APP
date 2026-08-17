import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme/theme";

const actions = [
  {
    title: "Nearby Hospitals",
    subtitle: "Find nearby emergency care",
    icon: "location",
    color: "#2563EB",
    route: "/(app)/map",
  },
  {
    title: "Health History",
    subtitle: "View previous vitals",
    icon: "bar-chart",
    color: "#8B5CF6",
    route: "/(app)/alerts",
  },
  {
    title: "Emergency Contacts",
    subtitle: "Manage emergency contacts",
    icon: "people",
    color: "#22C55E",
    route: "/(app)/emergency-contacts",
  },
];

export default function QuickActions() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Quick Actions</Text>

      {actions.map((item) => (
        <TouchableOpacity
          key={item.title}
          style={styles.card}
          onPress={() => router.push(item.route)}
        >
          <View
            style={[
              styles.iconBox,
              { backgroundColor: item.color + "22" },
            ]}
          >
            <Ionicons
              name={item.icon}
              size={22}
              color={item.color}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>
              {item.subtitle}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.muted}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 30,
  },

  heading: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 16,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    marginBottom: 14,
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  title: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 4,
    color: theme.colors.muted,
    fontSize: 12,
  },
});