import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "../theme/theme";

export default function AppButton({
  title,
  onPress,
  type = "primary", // primary | danger | dark
  disabled = false,
  style,
}) {
  const bg =
    type === "danger"
      ? theme.colors.danger
      : type === "dark"
      ? "#111"
      : theme.colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        { backgroundColor: disabled ? "#475569" : bg },
        style,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.colors.white,
    fontWeight: "900",
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
