import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import AppScreen from "../../components/AppScreen";
import NutritionCard from "../../components/NutritionCard";
import { theme } from "../../theme/theme";

export default function MealJournalScreen() {
  return (
    <View style={styles.container}>
      <AppScreen style={styles.appScreen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Nutrition Card & Meal Journal Component */}
          <NutritionCard />

          <View style={{ height: 100 }} />
        </ScrollView>
      </AppScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  appScreen: {
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
});
