import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../theme/theme";

const filters = [
  "Today",
  "Week",
  "Month",
  "Year",
];

export default function TimeFilter({
  onChange,
}) {
  const [selected, setSelected] = useState("Today");

  function selectFilter(filter) {
    setSelected(filter);
    onChange?.(filter);
  }

  return (
    <View style={styles.container}>
      {filters.map((filter) => {
        const active = selected === filter;

        return (
          <TouchableOpacity
            key={filter}
            style={[
              styles.button,
              active && styles.activeButton,
            ]}
            onPress={() => selectFilter(filter)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.text,
                active && styles.activeText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    padding: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  button: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 14,
  },

  activeButton: {
    backgroundColor: theme.colors.primary,
  },

  text: {
    color: theme.colors.muted,
    fontWeight: "700",
    fontSize: 14,
  },

  activeText: {
    color: "#fff",
    fontWeight: "900",
  },

});