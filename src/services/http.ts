
import { MATCHES_URL } from '../config';
import type { MatchesResponse } from '../models/match';

export async function getMatches(): Promise<MatchesResponse> {
  const response = await fetch(MATCHES_URL);

  if (!response.ok) {
    throw new Error(`Ошибка загрузки матчей: ${response.status}`);
  }

  const data: MatchesResponse = await response.json();

  return data;
}
