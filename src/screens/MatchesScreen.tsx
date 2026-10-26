import { FlatList, StyleSheet, Text, View } from "react-native";
import mockData from "../../data/matches.json";
import type { MatchesResponse, MatchFilter } from "../models/match";
import { MatchCard } from "../components/MatchCard";
import { useEffect, useState, useMemo } from "react";
import { getMatches } from "../services/http";
import { MatchFilters } from "../components/MatchFilters";
import { useFavorites } from "../hooks/useFavorites";
import { UpdatedAgo } from "../components/UpdatedAgo";

export function MatchesScreen() {
  const [state, setState] = useState<MatchesResponse | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [filter, setFilter] = useState<MatchFilter>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  const isFavorite = (id: string): boolean => {
    return favorites.includes(id);
  };

  const toggleFavorite = (id: string): void => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((favoriteId) => favoriteId !== id)
        : [...prev, id],
    );
  };

  useEffect(() => {
    let active = true;

    getMatches()
      .then((data) => {
        if (!active) return;

        if (!data || !Array.isArray(data.matches)) {
          throw new Error("Некорректный ответ сервера");
        }

        setState(data);
        setUpdatedAt(new Date());
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

  const filteredMatches = useMemo(() => {
    const matches = state?.matches ?? [];

    switch (filter) {
      case "scheduled":
        return matches.filter(
          (match) =>
            match.status === "scheduled" || match.status === "postponed",
        );

      case "finished":
        return matches.filter((match) => match.status === "finished");

      default:
        return matches;
    }
  }, [state, filter]);

  if (!state) {
    return <Text>Загрузка...</Text>;
  }

  const { round, matches } = state;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>МАТЧИ / {round} ТУР</Text>
      {updatedAt && <UpdatedAgo since={updatedAt} />}

      <View style={styles.content}>
        <MatchFilters value={filter} onChange={setFilter} />

        <FlatList
          data={filteredMatches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>Матчей пока нет</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 16,
  },
  title: {
    color: "#F9FAFB",
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 24,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  list: {
    flex: 1,
    minWidth: 0,
  },
  empty: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 32,
  },
});
