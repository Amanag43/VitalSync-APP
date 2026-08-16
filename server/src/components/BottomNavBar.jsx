import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { theme } from "../theme/theme";

export default function BottomNavBar({ onPlusPress }) {
  const pathname = usePathname();

  const tabs = [
    { name: "HOME", route: "/(app)/home", icon: "home-outline", activeIcon: "home" },
    { name: "STATS", route: "/(app)/stats", icon: "bar-chart-outline", activeIcon: "bar-chart" },
    { name: "ALERTS", route: "/(app)/alerts", icon: "notifications-outline", activeIcon: "notifications" },
    { name: "PROFILE", route: "/(app)/settings", icon: "person-outline", activeIcon: "person" },
  ];

  const handleNavigate = (route) => {
    if (pathname !== route) {
      router.push(route);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        {/* Left Tabs: Home & Stats */}
        <View style={styles.tabGroup}>
          <Pressable onPress={() => handleNavigate(tabs[0].route)} style={styles.tabItem}>
            <Ionicons
              name={pathname.includes("home") ? tabs[0].activeIcon : tabs[0].icon}
              size={20}
              color={pathname.includes("home") ? theme.colors.rose : theme.colors.muted}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: pathname.includes("home") ? theme.colors.rose : theme.colors.muted },
              ]}
            >
              {tabs[0].name}
            </Text>
          </Pressable>

          <Pressable onPress={() => handleNavigate(tabs[1].route)} style={styles.tabItem}>
            <Ionicons
              name={pathname.includes("stats") ? tabs[1].activeIcon : tabs[1].icon}
              size={20}
              color={pathname.includes("stats") ? theme.colors.rose : theme.colors.muted}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: pathname.includes("stats") ? theme.colors.rose : theme.colors.muted },
              ]}
            >
              {tabs[1].name}
            </Text>
          </Pressable>
        </View>

        {/* Elevated Glowing Plus (+) FAB */}
        <View style={styles.fabWrapper}>
          <Pressable
            onPress={onPlusPress || (() => router.push("/(app)/alerts"))}
            style={({ pressed }) => [
              styles.fabButton,
              pressed && { transform: [{ scale: 0.94 }] },
            ]}
          >
            <Ionicons name="add" size={26} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Right Tabs: Alerts & Profile */}
        <View style={styles.tabGroup}>
          <Pressable onPress={() => handleNavigate(tabs[2].route)} style={styles.tabItem}>
            <Ionicons
              name={pathname.includes("alerts") ? tabs[2].activeIcon : tabs[2].icon}
              size={20}
              color={pathname.includes("alerts") ? theme.colors.rose : theme.colors.muted}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: pathname.includes("alerts") ? theme.colors.rose : theme.colors.muted },
              ]}
            >
              {tabs[2].name}
            </Text>
          </Pressable>

          <Pressable onPress={() => handleNavigate(tabs[3].route)} style={styles.tabItem}>
            <Ionicons
              name={pathname.includes("settings") ? tabs[3].activeIcon : tabs[3].icon}
              size={20}
              color={pathname.includes("settings") ? theme.colors.rose : theme.colors.muted}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: pathname.includes("settings") ? theme.colors.rose : theme.colors.muted },
              ]}
            >
              {tabs[3].name}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: "center",
    zIndex: 100,
  },
  barBackground: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.card,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: "100%",
    ...theme.shadow.floating,
  },
  tabGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: "900",
    marginTop: 3,
    letterSpacing: 0.8,
  },
  fabWrapper: {
    position: "relative",
    top: -14,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  fabButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.rose,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: theme.colors.bg,
    ...theme.shadow.glowRose,
  },
});
