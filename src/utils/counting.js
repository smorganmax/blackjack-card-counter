import { NUM_DECKS, TOTAL_CARDS } from './deck';

export function hiLoValue(card) {
  const rank = card.rank;
  if (['2', '3', '4', '5', '6'].includes(rank)) return 1;
  if (['7', '8', '9'].includes(rank)) return 0;
  return -1; // 10, J, Q, K, A
}

export function runningCount(dealtCards) {
  return dealtCards.reduce((count, card) => count + hiLoValue(card), 0);
}

export function decksRemaining(shoeSize) {
  return Math.max(shoeSize / 52, 0.5);
}

export function trueCount(rc, shoeSize) {
  return Math.round((rc / decksRemaining(shoeSize)) * 10) / 10;
}

export function countForCards(cards) {
  return cards.reduce((sum, card) => sum + hiLoValue(card), 0);
}

export function shoeProgress(shoeSize) {
  return Math.round(((TOTAL_CARDS - shoeSize) / TOTAL_CARDS) * 100);
}

export function suggestedBet(tc, baseBet = 10) {
  if (tc <= 1) return baseBet;
  if (tc === 2) return baseBet * 2;
  if (tc === 3) return baseBet * 4;
  if (tc === 4) return baseBet * 8;
  return baseBet * 10;
}
