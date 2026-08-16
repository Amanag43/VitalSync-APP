import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/theme";

export default function SettingsItem({
  icon,
  iconColor = "#3B82F6",
  title,
  subtitle,
  value,
  onPress,
  danger = false,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      android_ripple={{ color: "#222" }}
      onPress={onPress}
    >
      {/* Left */}

      <View style={styles.left}>

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
            size={22}
            color={iconColor}
          />
        </View>

        <View style={styles.textContainer}>

          <Text
            style={[
              styles.title,
              danger && { color: "#FF3B30" },
            ]}
          >
            {title}
          </Text>

          {!!subtitle && (
            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          )}

        </View>

      </View>

      {/* Right */}

      <View style={styles.right}>

        {!!value && (
          <Text style={styles.value}>
            {value}
          </Text>
        )}

        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.colors.muted}
        />

      </View>

    </Pressable>
  );
}

const styles = StyleSheet.create({

  container: {
    height: 74,
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    paddingHorizontal: 18,
    marginBottom: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  pressed: {
    opacity: 0.8,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    marginLeft: 16,
    flex: 1,
  },

  title: {
    color: theme.colors.text,
    fontWeight: "800",
    fontSize: 16,
  },

  subtitle: {
    marginTop: 4,
    color: theme.colors.muted,
    fontSize: 13,
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
  },

  value: {
    color: theme.colors.muted,
    marginRight: 10,
    fontWeight: "700",
  },

});