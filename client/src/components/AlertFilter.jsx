import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme/theme";

const filters = [
  "All",
  "Critical",
  "Warning",
  "Resolved",
];

export default function AlertFilter({
  selected,
  onSelect,
}) {
  return (
    <View style={styles.container}>
      {filters.map((item) => {
        const active = item === selected;

        return (
          <Pressable
            key={item}
            onPress={() => onSelect(item)}
            style={[
              styles.chip,
              active && styles.activeChip,
            ]}
          >
            <Text
              style={[
                styles.text,
                active && styles.activeText,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 18,
    gap: 10,
    flexWrap: "wrap",
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  activeChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  text: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 13,
  },

  activeText: {
    color: "#fff",
  },
});