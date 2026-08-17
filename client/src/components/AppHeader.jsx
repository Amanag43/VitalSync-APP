import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/theme";

export default function AppHeader({ title, subtitle, leftIcon, onLeftPress, rightIcon, onRightPress }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onLeftPress} style={styles.iconBtn}>
        <Ionicons name={leftIcon || "chevron-back"} size={18} color={theme.colors.text} />
      </Pressable>

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>

      <Pressable onPress={onRightPress} style={styles.iconBtn}>
        <Ionicons name={rightIcon || "ellipsis-horizontal"} size={18} color={theme.colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: theme.colors.chip,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: theme.colors.text, fontSize: 18, fontWeight: "900" },
  sub: { marginTop: 2, color: theme.colors.muted, fontWeight: "700", fontSize: 12 },
});
