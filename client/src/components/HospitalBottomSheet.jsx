import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme/theme";
import { formatDistance, formatETA } from "../utils/routeUtils";

export default function HospitalBottomSheet({
  hospital,
  route,
  onNavigate,
  onCall,
}) {
  if (!hospital || !route) return null;

  return (
    <View style={styles.container}>
      <View style={styles.handle} />

      <View style={styles.header}>
        <View style={styles.icon}>
          <Ionicons
            name="medical"
            size={26}
            color={theme.colors.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {hospital.name}
          </Text>

          <Text style={styles.type}>
            Emergency Hospital
          </Text>
        </View>
      </View>

      <View style={styles.stats}>

        <View style={styles.stat}>
          <Text style={styles.label}>Distance</Text>

          <Text style={styles.value}>
            {formatDistance(route.distance)}
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.label}>ETA</Text>

          <Text style={styles.value}>
            {formatETA(route.duration)}
          </Text>
        </View>

      </View>

      <View style={styles.buttons}>

        <TouchableOpacity
          style={styles.primary}
          onPress={onNavigate}
        >
          <Ionicons
            name="navigate"
            color="white"
            size={18}
          />

          <Text style={styles.primaryText}>
            Navigate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondary}
          onPress={onCall}
        >
          <Ionicons
            name="call"
            color={theme.colors.primary}
            size={18}
          />

          <Text style={styles.secondaryText}>
            Call
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    backgroundColor: theme.colors.card,

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    padding: 20,

    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },

  handle: {
    width: 60,
    height: 6,
    borderRadius: 20,
    backgroundColor: theme.colors.border,
    alignSelf: "center",
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  name: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 18,
  },

  type: {
    color: theme.colors.muted,
    marginTop: 4,
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },

  stat: {
    alignItems: "center",
    flex: 1,
  },

  label: {
    color: theme.colors.muted,
    fontSize: 12,
  },

  value: {
    color: theme.colors.text,
    marginTop: 5,
    fontWeight: "900",
    fontSize: 18,
  },

  buttons: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },

  primary: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",
    gap: 8,
  },

  secondary: {
    flex: 1,
    height: 52,
    borderRadius: 16,

    borderWidth: 1,
    borderColor: theme.colors.primary,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",
    gap: 8,
  },

  primaryText: {
    color: "white",
    fontWeight: "900",
  },

  secondaryText: {
    color: theme.colors.primary,
    fontWeight: "900",
  },

});