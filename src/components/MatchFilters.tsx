
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { MatchFilter } from "../models/match";


interface Props {
  value: MatchFilter;
  onChange: (filter: MatchFilter) => void;
}

const filters: { label: string; value: MatchFilter }[] = [
  { label: "Все", value: "all" },
  { label: "Предстоящие", value: "scheduled" },
  { label: "Завершённые", value: "finished" },
];

export function MatchFilters({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {filters.map((filter) => (
        <Pressable
          key={filter.value}
          onPress={() => onChange(filter.value)}
          style={[
            styles.button,
            value === filter.value && styles.active,
          ]}
        >
          <Text
            style={[
              styles.text,
              value === filter.value && styles.activeText,
            ]}
          >
            {filter.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 112,
    gap: 10,
  },
  button: {
    backgroundColor: "#273244",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  active: {
    backgroundColor: "#F97316",
  },
  text: {
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: "600",
  },
  activeText: {
    color: "#FFFFFF",
  },
});