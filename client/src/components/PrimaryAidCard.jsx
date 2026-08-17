import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useVitalsStore } from "../store/vitalsStore";
import { theme } from "../theme/theme";
import { getPrimaryAid } from "../utils/primaryAid";

export default function PrimaryAidCard() {
  const emergencyActive = useVitalsStore((s) => s.emergencyActive);
  const emergencyReason = useVitalsStore((s) => s.emergencyReason);

  if (!emergencyActive) return null;

  const aid = getPrimaryAid(emergencyReason);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="medkit" size={18} color={theme.colors.primary} />
        <Text style={styles.title}>{aid.title}</Text>
      </View>

      {aid.steps.map((step, idx) => (
        <Text key={idx} style={styles.step}>
          • {step}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  title: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 15,
  },
  step: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 13,
    marginTop: 6,
  },
});
