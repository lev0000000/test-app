import { FlatList, StyleSheet, Text, View } from "react-native";
import mockData from "../../data/matches.json";
import type { MatchesResponse } from "../models/match";
import { MatchCard } from "../components/MatchCard";
import { useEffect, useState } from "react";
import { getMatches } from "../services/http";

export function MatchesScreen() {
  const [state, setState] = useState<MatchesResponse | null>(null);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    let active = true;

    getMatches()
      .then((data) => {
        if (!active) return;

        if (!data || !Array.isArray(data.matches)) {
          throw new Error("Некорректный ответ сервера");
        }

        setState(data);
        setIsMock(false);
      })
      .catch(() => {
        if (!active) return;

        setState(mockData as MatchesResponse);
        setIsMock(true);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!state) {
    return <Text>Загрузка...</Text>;
  }

  const { round, matches } = state;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Матчи тура {round}</Text>

      {isMock && (
        <Text style={styles.warning}>
          Сервер недоступен. Показаны тестовые данные.
        </Text>
      )}

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MatchCard match={item} />}
        ListEmptyComponent={<Text>Матчей пока нет</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  warning: {
    color: "#b45309",
    marginBottom: 12,
  },
});