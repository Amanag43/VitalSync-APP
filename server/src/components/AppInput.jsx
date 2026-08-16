import { StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "../theme/theme";

export default function AppInput({ label, ...props }) {
  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor="#64748B"
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: theme.colors.muted,
    fontWeight: "700",
    marginBottom: 6,
    fontSize: 12,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: 14,
    color: theme.colors.text,
    fontWeight: "700",
  },
});
