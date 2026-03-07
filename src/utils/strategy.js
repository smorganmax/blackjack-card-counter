import { handTotal, isSoft, canSplit } from './hand';
import { cardValue } from './deck';

// Basic Strategy for 2-deck, H17 (dealer hits soft 17)
// Returns: 'H' (hit), 'S' (stand), 'D' (double/hit), 'Ds' (double/stand), 'P' (split), 'Ph' (split if DAS, else hit), 'Rh' (surrender/hit), 'Rs' (surrender/stand), 'Rp' (surrender/split)

// Dealer upcard index: 2=0, 3=1, ..., 9=7, 10=8, A=9
function dealerIndex(upcard) {
  if (upcard.rank === 'A') return 9;
  const v = cardValue(upcard);
  return v - 2; // 2->0, 3->1, ..., 10->8
}

// Hard totals: rows 5-21, columns dealer 2-A
const HARD = {
  5:  ['H','H','H','H','H','H','H','H','H','H'],
  6:  ['H','H','H','H','H','H','H','H','H','H'],
  7:  ['H','H','H','H','H','H','H','H','H','H'],
  8:  ['H','H','H','H','H','H','H','H','H','H'],
  9:  ['H','D','D','D','D','H','H','H','H','H'],
  10: ['D','D','D','D','D','D','D','D','H','H'],
  11: ['D','D','D','D','D','D','D','D','D','D'],
  12: ['H','H','S','S','S','H','H','H','H','H'],
  13: ['S','S','S','S','S','H','H','H','H','H'],
  14: ['S','S','S','S','S','H','H','H','H','H'],
  15: ['S','S','S','S','S','H','H','H','H','H'],
  16: ['S','S','S','S','S','H','H','H','Rh','H'],
  17: ['S','S','S','S','S','S','S','S','S','S'],
  18: ['S','S','S','S','S','S','S','S','S','S'],
  19: ['S','S','S','S','S','S','S','S','S','S'],
  20: ['S','S','S','S','S','S','S','S','S','S'],
  21: ['S','S','S','S','S','S','S','S','S','S'],
};

// Soft totals: A+2 through A+9 (soft 13 through soft 20)
const SOFT = {
  13: ['H','H','H','D','D','H','H','H','H','H'],
  14: ['H','H','H','D','D','H','H','H','H','H'],
  15: ['H','H','D','D','D','H','H','H','H','H'],
  16: ['H','H','D','D','D','H','H','H','H','H'],
  17: ['H','D','D','D','D','H','H','H','H','H'],
  18: ['Ds','Ds','Ds','Ds','Ds','S','S','H','H','H'],
  19: ['S','S','S','S','Ds','S','S','S','S','S'],
  20: ['S','S','S','S','S','S','S','S','S','S'],
};

// Pair splitting: rows are pair card value (A=11, 10, 9, 8, ..., 2)
const PAIRS = {
  'A': ['P','P','P','P','P','P','P','P','P','P'],
  '10':['S','S','S','S','S','S','S','S','S','S'],
  '9': ['P','P','P','P','P','S','P','P','S','S'],
  '8': ['P','P','P','P','P','P','P','P','P','P'],
  '7': ['P','P','P','P','P','P','H','H','H','H'],
  '6': ['Ph','P','P','P','P','H','H','H','H','H'],
  '5': ['D','D','D','D','D','D','D','D','H','H'],
  '4': ['H','H','H','Ph','Ph','H','H','H','H','H'],
  '3': ['Ph','Ph','P','P','P','P','H','H','H','H'],
  '2': ['Ph','Ph','P','P','P','P','H','H','H','H'],
};

// Get the pair key for a card rank
function pairKey(rank) {
  if (['10', 'J', 'Q', 'K'].includes(rank)) return '10';
  return rank;
}

/**
 * Get basic strategy recommendation for a player hand vs dealer upcard.
 * @param {Array} playerCards - player's cards
 * @param {Object} dealerUpcard - dealer's face-up card
 * @param {boolean} canDAS - can double after split (default true for our rules)
 * @returns {{ action: string, raw: string, handType: string }}
 *   action: 'hit', 'stand', 'double', 'split', 'surrender'
 *   raw: the chart code (H, S, D, Ds, P, Ph, Rh, Rs, Rp)
 *   handType: 'hard', 'soft', 'pair'
 */
export function getBasicStrategy(playerCards, dealerUpcard, canDAS = true) {
  if (!playerCards || playerCards.length < 2 || !dealerUpcard) return null;

  const di = dealerIndex(dealerUpcard);
  const total = handTotal(playerCards);
  const soft = isSoft(playerCards);
  const isPair = playerCards.length === 2 && canSplit(playerCards);

  let raw, handType;

  // Check pairs first
  if (isPair) {
    const pk = pairKey(playerCards[0].rank);
    raw = PAIRS[pk]?.[di];
    handType = 'pair';
    if (raw === 'Ph' && !canDAS) {
      raw = 'H';
      handType = 'hard';
    }
  }

  // If not a pair play, check soft
  if (!raw || raw === 'S' || raw === 'H') {
    if (isPair && raw) {
      // Keep the pair recommendation if it's S or H (like 10,10 -> S)
    } else if (soft && SOFT[total]) {
      raw = SOFT[total][di];
      handType = 'soft';
    } else {
      const t = Math.min(Math.max(total, 5), 21);
      raw = HARD[t]?.[di] || 'H';
      handType = 'hard';
    }
  }

  // For pair recommendations that weren't overridden
  if (isPair && handType === 'pair') {
    // Keep pair recommendation
  }

  return {
    action: resolveAction(raw, playerCards.length),
    raw,
    handType: handType || 'hard',
  };
}

/**
 * Resolve a chart code to a concrete action.
 * If can't double (more than 2 cards), D -> H, Ds -> S
 */
function resolveAction(raw, numCards) {
  const canDouble = numCards === 2;

  switch (raw) {
    case 'H': return 'hit';
    case 'S': return 'stand';
    case 'D':
      return canDouble ? 'double' : 'hit';
    case 'Ds':
      return canDouble ? 'double' : 'stand';
    case 'P':
    case 'Ph':
    case 'Rp':
      return 'split';
    case 'Rh':
      return canDouble ? 'surrender' : 'hit'; // we don't have surrender, so hit
    case 'Rs':
      return canDouble ? 'surrender' : 'stand';
    default:
      return 'hit';
  }
}

/**
 * Check if a player action matches basic strategy.
 * @param {string} playerAction - 'hit', 'stand', 'double', 'split'
 * @param {Array} playerCards - player's cards
 * @param {Object} dealerUpcard - dealer's face-up card
 * @returns {{ correct: boolean, recommended: string, handType: string }}
 */
export function checkStrategy(playerAction, playerCards, dealerUpcard) {
  const strat = getBasicStrategy(playerCards, dealerUpcard);
  if (!strat) return { correct: true, recommended: playerAction, handType: 'hard' };

  let correct = playerAction === strat.action;

  // Surrender not available in our game, so hitting/standing is acceptable for surrender situations
  if (strat.action === 'surrender') {
    if (strat.raw === 'Rh' && playerAction === 'hit') correct = true;
    if (strat.raw === 'Rs' && playerAction === 'stand') correct = true;
  }

  return {
    correct,
    recommended: strat.action,
    handType: strat.handType,
  };
}

/**
 * Format action name for display.
 */
export function actionLabel(action) {
  switch (action) {
    case 'hit': return 'Hit';
    case 'stand': return 'Stand';
    case 'double': return 'Double';
    case 'split': return 'Split';
    case 'surrender': return 'Surrender';
    default: return action;
  }
}
