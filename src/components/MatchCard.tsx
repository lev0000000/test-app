import { StyleSheet, Text, View } from "react-native";
import type { Match } from "../models/match";
import { FavoriteButton } from "./FavoriteButton";

interface Props {
  match: Match;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const statusLabels: Record<Match["status"], string> = {
  finished: "Завершён",
  live: "Идёт",
  scheduled: "Предстоящий",
  postponed: "Перенесён",
};

export function MatchCard({
  match,
  isFavorite,
  onToggleFavorite,
}: Props)  {
  const { home, away, score, status, startsAt, minute } = match;

  const date = startsAt
    ? new Date(startsAt).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Дата уточняется";

  return (
    <View style={styles.card}>
      <FavoriteButton active={isFavorite} onPress={onToggleFavorite} />
      <View style={styles.header}>
        <Text style={styles.date}>{date}</Text>

        <Text style={[styles.status, status === "live" && styles.live]}>
          {statusLabels[status]}
          {status === "live" && minute != null ? ` · ${minute}'` : ""}
        </Text>
      </View>
      <View style={styles.teams}>
        <View style={styles.team}>
          <Text style={styles.teamName}>{home.name}</Text>
          <Text style={styles.city}>{home.city}</Text>
        </View>

        <Text style={styles.score}>
          {score !== null ? `${score.home} : ${score.away}` : "— : —"}
        </Text>

        <View style={[styles.team, styles.away]}>
          <Text style={styles.teamName}>{away.name}</Text>
          <Text style={styles.city}>{away.city}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  date: {
    color: "#6b7280",
    fontSize: 13,
  },
  status: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "600",
  },
  live: {
    color: "#16a34a",
  },
  teams: {
    flexDirection: "row",
    alignItems: "center",
  },
  team: {
    flex: 1,
  },
  away: {
    alignItems: "flex-end",
  },
  teamName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  city: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  score: {
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 12,
    color: "#111827",
  },
});
