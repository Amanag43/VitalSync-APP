import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/theme";

export default function StatusPill({ type = "online" }) {
  const getStyle = () => {
    if (type === "sos") {
      return { bg: theme.colors.dangerSoft, text: theme.colors.danger, label: "SOS" };
    }
    if (type === "offline") {
      return { bg: theme.colors.chip, text: theme.colors.muted, label: "OFFLINE" };
    }
    return { bg: theme.colors.successSoft, text: theme.colors.success, label: "ONLINE" };
  };

  const s = getStyle();

  return (
    <View style={[styles.pill, { backgroundColor: s.bg, borderColor: theme.colors.border }]}>
      <Text style={[styles.txt, { color: s.text }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  txt: { fontWeight: "900", fontSize: 11, letterSpacing: 0.4 },
});
