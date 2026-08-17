import React, { useState } from "react";
import { View, StyleSheet, Modal, Text, Pressable } from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomNavBar from "../../components/BottomNavBar";
import { theme } from "../../theme/theme";

export default function AppLayout() {
  const [quickLogModalVisible, setQuickLogModalVisible] = useState(false);

  const handlePlusPress = () => {
    setQuickLogModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="stats" />
        <Stack.Screen name="alerts" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="map" />
        <Stack.Screen name="emergency-contacts" />
        <Stack.Screen name="health-trends" />
      </Stack>

      {/* Floating Bottom Navigation Bar */}
      <BottomNavBar onPlusPress={handlePlusPress} />

      {/* Quick Health Logging Modal when pressing central (+) FAB */}
      <Modal
        visible={quickLogModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setQuickLogModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setQuickLogModalVisible(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.modalTitle}>Quick Actions</Text>
            <Text style={styles.modalSubtitle}>What would you like to view or trigger?</Text>

            <View style={styles.actionsGrid}>
              <Pressable
                style={styles.actionCard}
                onPress={() => {
                  setQuickLogModalVisible(false);
                  router.push("/(app)/emergency-contacts");
                }}
              >
                <View style={[styles.actionIconBox, { backgroundColor: theme.colors.amberSoft }]}>
                  <Ionicons name="people" size={20} color={theme.colors.amber} />
                </View>
                <Text style={styles.actionLabel}>Contacts</Text>
              </Pressable>

              <Pressable
                style={styles.actionCard}
                onPress={() => {
                  setQuickLogModalVisible(false);
                  router.push("/(app)/health-trends");
                }}
              >
                <View style={[styles.actionIconBox, { backgroundColor: theme.colors.roseSoft }]}>
                  <Ionicons name="pulse" size={20} color={theme.colors.rose} />
                </View>
                <Text style={styles.actionLabel}>Trends</Text>
              </Pressable>

              <Pressable
                style={styles.actionCard}
                onPress={() => {
                  setQuickLogModalVisible(false);
                  router.push("/(app)/map");
                }}
              >
                <View style={[styles.actionIconBox, { backgroundColor: theme.colors.mintSoft }]}>
                  <Ionicons name="alert-circle" size={20} color={theme.colors.mint} />
                </View>
                <Text style={styles.actionLabel}>SOS Map</Text>
              </Pressable>

              <Pressable
                style={styles.actionCard}
                onPress={() => {
                  setQuickLogModalVisible(false);
                  router.push("/(app)/stats");
                }}
              >
                <View style={[styles.actionIconBox, { backgroundColor: theme.colors.violetSoft }]}>
                  <Ionicons name="analytics" size={20} color={theme.colors.violet} />
                </View>
                <Text style={styles.actionLabel}>Analytics</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.closeBtn}
              onPress={() => setQuickLogModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalSheet: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: theme.spacing.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.text,
  },
  modalSubtitle: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 4,
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    width: "100%",
    marginBottom: 20,
  },
  actionCard: {
    width: "47%",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: theme.radius.md,
    padding: 14,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.text,
  },
  closeBtn: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: theme.colors.chip,
    borderRadius: theme.radius.sm,
    alignItems: "center",
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.muted,
  },
});