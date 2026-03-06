const STATS_KEY = 'blackjack-counter-stats';

export function loadStats() {
  try {
    const data = localStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : defaultStats();
  } catch {
    return defaultStats();
  }
}

export function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // localStorage unavailable
  }
}

export function defaultStats() {
  return {
    handsPlayed: 0,
    wins: 0,
    losses: 0,
    pushes: 0,
    blackjacks: 0,
    busts: 0,
    chips: 1000,
    countGuesses: 0,
    countCorrect: 0,
    sessions: []
  };
}

export function clearStats() {
  try {
    localStorage.removeItem(STATS_KEY);
  } catch {
    // localStorage unavailable
  }
}
