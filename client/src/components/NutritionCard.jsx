import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";

export default function NutritionCard() {
  const [search, setSearch] = useState("");

  const meals = [
    {
      id: 1,
      type: "Breakfast",
      desc: "Oatmeal, Coffee",
      kcal: 420,
      icon: "cafe",
      iconColor: theme.colors.amber,
      logged: true,
    },
    {
      id: 2,
      type: "Lunch",
      desc: "Chicken Salad",
      kcal: 580,
      icon: "leaf",
      iconColor: theme.colors.mint,
      logged: true,
    },
    {
      id: 3,
      type: "Dinner",
      desc: "Not logged yet",
      kcal: 0,
      icon: "restaurant",
      iconColor: theme.colors.muted,
      logged: false,
    },
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionLabel}>NUTRITION TRACKER</Text>
          <Text style={styles.title}>MEAL JOURNAL</Text>
        </View>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="book-outline" size={16} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={theme.colors.muted} />
        <TextInput
          placeholder="Search foods or brands..."
          placeholderTextColor={theme.colors.muted}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Summary grid */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryVal}>1,840</Text>
          <Text style={styles.summaryLabel}>EATEN</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryCol}>
          <Text style={styles.summaryVal}>2,200</Text>
          <Text style={styles.summaryLabel}>GOAL</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryCol}>
          <Text style={[styles.summaryVal, { color: theme.colors.mint }]}>360</Text>
          <Text style={styles.summaryLabel}>LEFT</Text>
        </View>
      </View>

      {/* Macro Split Pills */}
      <View style={styles.macrosRow}>
        <View style={styles.macroPill}>
          <Text style={styles.macroName}>CARBS</Text>
          <Text style={styles.macroVal}>120G</Text>
          <View style={[styles.macroLine, { backgroundColor: theme.colors.violet }]} />
        </View>

        <View style={styles.macroPill}>
          <Text style={styles.macroName}>PROTEIN</Text>
          <Text style={styles.macroVal}>95G</Text>
          <View style={[styles.macroLine, { backgroundColor: theme.colors.rose }]} />
        </View>

        <View style={styles.macroPill}>
          <Text style={styles.macroName}>FAT</Text>
          <Text style={styles.macroVal}>42G</Text>
          <View style={[styles.macroLine, { backgroundColor: theme.colors.amber }]} />
        </View>
      </View>

      {/* Meals List */}
      <View style={styles.mealsHeaderRow}>
        <Text style={styles.mealsTitle}>TODAY'S MEALS</Text>
        <Text style={styles.historyLink}>HISTORY</Text>
      </View>

      <View style={styles.mealsList}>
        {meals.map((item) => (
          <View key={item.id} style={styles.mealItem}>
            <View style={[styles.mealIconBox, { backgroundColor: "rgba(255,255,255,0.05)" }]}>
              <Ionicons name={item.icon} size={18} color={item.iconColor} />
            </View>

            <View style={styles.mealInfo}>
              <Text style={styles.mealType}>{item.type}</Text>
              <Text style={styles.mealDesc}>{item.desc}</Text>
            </View>

            {item.logged ? (
              <View style={styles.loggedBadge}>
                <Text style={styles.kcalText}>{item.kcal} kcal</Text>
                <Text style={styles.loggedText}>LOGGED</Text>
              </View>
            ) : (
              <Pressable style={styles.addMealBtn}>
                <Ionicons name="add" size={16} color={theme.colors.text} />
              </Pressable>
            )}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: theme.colors.muted,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
    marginTop: 2,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.chip,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  summaryGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    marginBottom: 16,
  },
  summaryCol: {
    alignItems: "center",
  },
  summaryVal: {
    fontSize: 18,
    fontWeight: "900",
    color: theme.colors.text,
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: theme.colors.muted,
    marginTop: 2,
    letterSpacing: 0.8,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border,
  },
  macrosRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 18,
  },
  macroPill: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 10,
    borderRadius: theme.radius.xs,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  macroName: {
    fontSize: 9,
    fontWeight: "900",
    color: theme.colors.muted,
    letterSpacing: 0.8,
  },
  macroVal: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.text,
    marginTop: 4,
    marginBottom: 6,
  },
  macroLine: {
    height: 3,
    borderRadius: 2,
  },
  mealsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  mealsTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    color: theme.colors.muted,
  },
  historyLink: {
    fontSize: 10,
    fontWeight: "900",
    color: theme.colors.amber,
    letterSpacing: 0.8,
  },
  mealsList: {
    gap: 10,
  },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: theme.radius.sm,
    padding: 12,
    gap: 12,
  },
  mealIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.text,
  },
  mealDesc: {
    fontSize: 11,
    color: theme.colors.muted,
    marginTop: 2,
  },
  loggedBadge: {
    alignItems: "flex-end",
  },
  kcalText: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.colors.text,
  },
  loggedText: {
    fontSize: 8,
    fontWeight: "900",
    color: theme.colors.muted,
    marginTop: 2,
    letterSpacing: 0.8,
  },
  addMealBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.amber,
    alignItems: "center",
    justifyContent: "center",
  },
});
