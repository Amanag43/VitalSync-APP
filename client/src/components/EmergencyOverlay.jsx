import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../theme/theme";

export default function EmergencyOverlay({
  visible,
  alert,
  onCancel,
  onFinished,
}) {
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      setCountdown(5);
      finishedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (e) {}

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [visible]);

  useEffect(() => {
    if (visible && countdown === 0 && !finishedRef.current) {
      finishedRef.current = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      onFinished?.();
    }
  }, [countdown, visible, onFinished]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="warning" size={48} color="#FF3B30" />
          </View>

          <Text style={styles.title}>EMERGENCY DETECTED</Text>
          <Text style={styles.reason}>{alert?.vital || "Abnormal Vital Triggered"}</Text>
          <Text style={styles.subtitle}>Automated SOS dispatch in</Text>
          <Text style={styles.count}>{countdown}</Text>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Ionicons name="close-circle-outline" size={22} color="white" style={{ marginRight: 6 }} />
            <Text style={styles.cancelText}>CANCEL SOS DISPATCH</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(5, 8, 15, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.colors.card,
    padding: 28,
    borderRadius: 28,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF3B30",
    ...theme.shadow.card,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 59, 48, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.3)",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.text,
    letterSpacing: 1,
  },
  reason: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "800",
    color: "#FF3B30",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 24,
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  count: {
    marginTop: 4,
    fontSize: 64,
    fontWeight: "900",
    color: "#FF3B30",
  },
  cancelButton: {
    marginTop: 24,
    width: "100%",
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF3B30",
  },
  cancelText: {
    color: "white",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 0.8,
  },
});
