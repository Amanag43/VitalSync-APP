import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";

export default function MilestoneBadges() {
  const badges = [
    {
      id: 1,
      title: "7 DAY STREAK",
      icon: "key",
      color: theme.colors.amber,
      bg: "rgba(255, 212, 59, 0.15)",
      unlocked: true,
    },
    {
      id: 2,
      title: "10K RUNNER",
      icon: "flame",
      color: theme.colors.rose,
      bg: "rgba(255, 107, 129, 0.15)",
      unlocked: true,
    },
    {
      id: 3,
      title: "EARLY BIRD",
      icon: "moon",
      color: theme.colors.violet,
      bg: "rgba(108, 92, 231, 0.15)",
      unlocked: true,
    },
    {
      id: 4,
      title: "MARATHON",
      icon: "trophy",
      color: theme.colors.muted,
      bg: "rgba(255, 255, 255, 0.06)",
      unlocked: false,
    },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>MILESTONES</Text>
      <View style={styles.badgesRow}>
        {badges.map((item) => (
          <View key={item.id} style={styles.badgeCol}>
            <View
              style={[
                styles.badgeCircle,
                { backgroundColor: item.bg, borderColor: item.unlocked ? item.color : theme.colors.border },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={item.unlocked ? item.color : theme.colors.muted}
              />
            </View>
            <Text style={styles.badgeTitle}>{item.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.m,
    ...theme.shadow.card,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.1,
    color: theme.colors.muted,
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  badgeCol: {
    alignItems: "center",
    gap: 6,
  },
  badgeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTitle: {
    fontSize: 9,
    fontWeight: "900",
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
