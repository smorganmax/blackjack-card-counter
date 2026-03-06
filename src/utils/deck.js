export const SUITS = ['♠', '♥', '♦', '♣'];
export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const NUM_DECKS = 2;
export const TOTAL_CARDS = NUM_DECKS * 52;
export const SHUFFLE_PENETRATION = 0.75;

export function createShoe(numDecks = NUM_DECKS) {
  const shoe = [];
  for (let d = 0; d < numDecks; d++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        shoe.push({ rank, suit });
      }
    }
  }
  return shuffle(shoe);
}

export function shuffle(cards) {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function shouldReshuffle(shoe) {
  return shoe.length <= TOTAL_CARDS * (1 - SHUFFLE_PENETRATION);
}

export function cardValue(card) {
  if (card.rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(card.rank)) return 10;
  return parseInt(card.rank, 10);
}

export function suitColor(suit) {
  return suit === '♥' || suit === '♦' ? 'red' : 'black';
}

export function cardLabel(card) {
  return `${card.rank}${card.suit}`;
}
