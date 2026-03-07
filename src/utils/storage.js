const STATS_KEY = 'blackjack-counter-stats';
const SETTINGS_KEY = 'blackjack-counter-settings';
const DRILL_HISTORY_KEY = 'blackjack-counter-drill-history';

export function loadStats() {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (data) return { ...defaultStats(), ...JSON.parse(data) };
    return defaultStats();
  } catch {
    return defaultStats();
  }
}

export function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
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
    sessions: [],
    strategyCorrect: 0,
    strategyTotal: 0,
    strategyByType: { hard: { correct: 0, total: 0 }, soft: { correct: 0, total: 0 }, pair: { correct: 0, total: 0 } },
    deviationCorrect: 0,
    deviationTotal: 0,
    betCorrect: 0,
    betTotal: 0,
    bigBetTcSum: 0,
    bigBetCount: 0,
    smallBetTcSum: 0,
    smallBetCount: 0,
    winsAtPositive: 0,
    handsAtPositive: 0,
    winsAtNegative: 0,
    handsAtNegative: 0,
    distractionCountCorrect: 0,
    distractionCountTotal: 0,
    normalCountCorrect: 0,
    normalCountTotal: 0,
    sessionHistory: [],
  };
}

export function clearStats() {
  try {
    localStorage.removeItem(STATS_KEY);
  } catch {}
}

export function loadSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) return { ...defaultSettings(), ...JSON.parse(data) };
    return defaultSettings();
  } catch {
    return defaultSettings();
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export function defaultSettings() {
  return {
    showCount: false,
    strategyHelper: false,
    betCoaching: false,
    deviationAlerts: true,
    casinoDistractions: false,
    showPenetration: true,
    showReliability: true,
    penetrationPercent: 75,
    countQuizInterval: 5,
  };
}

export function loadDrillHistory() {
  try {
    const data = localStorage.getItem(DRILL_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDrillHistory(history) {
  try {
    localStorage.setItem(DRILL_HISTORY_KEY, JSON.stringify(history.slice(-50)));
  } catch {}
}
