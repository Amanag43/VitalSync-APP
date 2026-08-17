import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/theme";
import { router } from "expo-router";
export default function ProfileCard({
  name,
  email,
  onEdit = () => router.push("/edit-profile"),
}) {
  const initials = getInitials(name);
  return (
    <View style={styles.card}>

      {/* Avatar */}

      <View style={styles.avatar}>
        <Text style={styles.initials}>
          {initials}
        </Text>
      </View>

      {/* User */}

      <Text style={styles.name}>
        {name}
      </Text>

      <View style={styles.badge}>

        <Ionicons
          name="checkmark-circle"
          size={14}
          color="#22C55E"
        />

        <Text style={styles.badgeText}>
          Verified Account
        </Text>

      </View>

      <Text style={styles.email}>
        {email}
      </Text>

      <Pressable
        style={styles.button}
        onPress={onEdit}
      >
        <Ionicons
          name="create-outline"
          size={18}
          color="white"
        />

        <Text style={styles.buttonText}>
          Edit Profile
        </Text>

      </Pressable>

    </View>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 30,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 22,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  initials: {
    color: "white",
    fontWeight: "900",
    fontSize: 34,
  },

  name: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: "900",
    color: theme.colors.text,
  },

  badge: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16381F",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
  },

  badgeText: {
    marginLeft: 6,
    color: "#22C55E",
    fontWeight: "700",
    fontSize: 13,
  },

  email: {
    marginTop: 12,
    color: theme.colors.muted,
    fontSize: 15,
  },

  button: {
    marginTop: 24,
    width: "100%",
    height: 52,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    marginLeft: 8,
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },

});