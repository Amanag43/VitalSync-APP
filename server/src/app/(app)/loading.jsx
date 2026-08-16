import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { theme } from "../../theme/theme";

export default function LoadingScreen() {
  const glow = useSharedValue(0.35);

  useEffect(() => {
    glow.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: 1 + glow.value * 0.03 }],
  }));

  return (
    <View style={styles.container}>
      {/* Glow background */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Logo with glow */}
      <Animated.View style={[styles.logoWrap, glowStyle]}>
        <View style={styles.logoBox}>
          <Ionicons
            name="shield-checkmark"
            size={34}
            color={theme.colors.primary}
          />
        </View>
      </Animated.View>

      <Text style={styles.title}>VitalSync</Text>
      <Text style={styles.sub}>Securing health in real-time</Text>

      <View style={styles.loadingRow}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      <Text style={styles.footer}>Initializing secure session...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  glowTop: {
    position: "absolute",
    top: -150,
    left: -90,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(37,99,235,0.22)",
  },

  glowBottom: {
    position: "absolute",
    bottom: -170,
    right: -110,
    width: 360,
    height: 360,
    borderRadius: 999,
    backgroundColor: "rgba(22,163,74,0.10)",
  },

  logoWrap: {
    marginBottom: 14,
  },

  logoBox: {
    width: 86,
    height: 86,
    borderRadius: 28,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  sub: {
    marginTop: 6,
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },

  loadingRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 18,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  footer: {
    marginTop: 18,
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
});

