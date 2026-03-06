import { cardValue } from './deck';

export function handTotal(cards) {
  let total = 0;
  let aces = 0;
  for (const card of cards) {
    const val = cardValue(card);
    total += val;
    if (card.rank === 'A') aces++;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

export function isSoft(cards) {
  let total = 0;
  let aces = 0;
  for (const card of cards) {
    const val = cardValue(card);
    total += val;
    if (card.rank === 'A') aces++;
  }
  while (total > 21 && aces > 1) {
    total -= 10;
    aces--;
  }
  return aces > 0 && total <= 21;
}

export function isBlackjack(cards) {
  return cards.length === 2 && handTotal(cards) === 21;
}

export function isBust(cards) {
  return handTotal(cards) > 21;
}

export function canSplit(cards) {
  return cards.length === 2 && cardValue(cards[0]) === cardValue(cards[1]);
}

export function canDoubleDown(cards) {
  return cards.length === 2;
}

export function handResult(playerCards, dealerCards) {
  const pTotal = handTotal(playerCards);
  const dTotal = handTotal(dealerCards);
  const pBJ = isBlackjack(playerCards);
  const dBJ = isBlackjack(dealerCards);

  if (pBJ && dBJ) return 'push';
  if (pBJ) return 'blackjack';
  if (dBJ) return 'lose';
  if (pTotal > 21) return 'bust';
  if (dTotal > 21) return 'win';
  if (pTotal > dTotal) return 'win';
  if (pTotal < dTotal) return 'lose';
  return 'push';
}
