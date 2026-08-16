import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/theme";

export default function SettingsSection({
  title,
  children,
}) {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        {title}
      </Text>

      <View style={styles.content}>
        {children}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    marginBottom: 28,
  },

  title: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  content: {
    gap: 12,
  },

});