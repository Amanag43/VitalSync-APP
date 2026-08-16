import { Ionicons } from "@expo/vector-icons";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppScreen from "./AppScreen";
import { router } from "expo-router";
import { theme } from "../theme/theme";

export default function FeatureDashboard({ title, subtitle, icon, accent = theme.colors.primary, metrics = [], sections = [], action }) {
  return (
    <AppScreen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.back} />
        </View>

        <View style={[styles.hero, { borderColor: `${accent}55` }]}>
          <View style={[styles.heroIcon, { backgroundColor: `${accent}22` }]}>
            <Ionicons name={icon} size={28} color={accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>{title}</Text>
            <Text style={styles.heroSubtitle}>{subtitle}</Text>
          </View>
        </View>

        {metrics.length > 0 && <View style={styles.metrics}>
          {metrics.map((metric) => <View key={metric.label} style={styles.metric}>
            <Text style={[styles.metricValue, { color: metric.color || theme.colors.text }]}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            {metric.caption && <Text style={styles.metricCaption}>{metric.caption}</Text>}
          </View>)}
        </View>}

        {sections.map((section) => <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item) => <TouchableOpacity
            key={item.title}
            activeOpacity={0.8}
            style={styles.item}
            onPress={() => item.onPress ? item.onPress() : Alert.alert(item.title, item.detail || "This experience will connect to live data in the next backend phase.")}
          >
            <View style={[styles.itemIcon, { backgroundColor: `${item.color || accent}22` }]}>
              <Ionicons name={item.icon || "sparkles-outline"} size={20} color={item.color || accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDetail}>{item.detail}</Text>
            </View>
            {item.value && <Text style={[styles.itemValue, { color: item.color || accent }]}>{item.value}</Text>}
            <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
          </TouchableOpacity>)}
        </View>)}

        {action && <TouchableOpacity style={[styles.action, { backgroundColor: accent }]} onPress={action.onPress}>
          <Ionicons name={action.icon || "add"} size={20} color="#fff" />
          <Text style={styles.actionText}>{action.label}</Text>
        </TouchableOpacity>}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 38 }, header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  back: { width: 42, height: 42, borderRadius: 14, backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border, alignItems: "center", justifyContent: "center" },
  headerTitle: { color: theme.colors.text, fontWeight: "900", fontSize: 19 },
  hero: { flexDirection: "row", gap: 14, padding: 18, borderRadius: 24, backgroundColor: theme.colors.card, borderWidth: 1, marginBottom: 16 },
  heroIcon: { width: 58, height: 58, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  heroTitle: { color: theme.colors.text, fontSize: 20, fontWeight: "900" }, heroSubtitle: { color: theme.colors.muted, fontSize: 13, lineHeight: 19, marginTop: 4 },
  metrics: { flexDirection: "row", gap: 10, marginBottom: 22 }, metric: { flex: 1, backgroundColor: theme.colors.card, borderRadius: 18, borderWidth: 1, borderColor: theme.colors.border, padding: 13 },
  metricValue: { fontSize: 20, fontWeight: "900" }, metricLabel: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: "700", marginTop: 4 }, metricCaption: { color: theme.colors.muted, fontSize: 10, marginTop: 3 },
  section: { marginBottom: 22 }, sectionTitle: { color: theme.colors.text, fontSize: 18, fontWeight: "900", marginBottom: 10 },
  item: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border, padding: 14, borderRadius: 18, marginBottom: 9 },
  itemIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" }, itemTitle: { color: theme.colors.text, fontSize: 14, fontWeight: "800" }, itemDetail: { color: theme.colors.muted, fontSize: 12, marginTop: 3 }, itemValue: { fontWeight: "900", fontSize: 13 },
  action: { height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, marginTop: 4 }, actionText: { color: "#fff", fontWeight: "900", fontSize: 15 },
});
