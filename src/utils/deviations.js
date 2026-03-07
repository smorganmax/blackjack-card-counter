import { handTotal, isSoft, canSplit } from './hand';
import { cardValue } from './deck';

/**
 * The Illustrious 18 - most important index plays for card counters.
 * Each deviation specifies when to deviate from basic strategy based on true count.
 *
 * Format:
 *   playerTotal: hard total (or 'insurance' for insurance)
 *   dealerRank: dealer upcard rank
 *   isPair: if this is a pair situation
 *   threshold: true count at which to deviate
 *   deviationAction: what to do when TC >= threshold
 *   basicAction: what basic strategy says normally
 *   direction: 'gte' means deviate when TC >= threshold, 'lt' means deviate below
 */
export const ILLUSTRIOUS_18 = [
  { id: 1,  label: 'Insurance',         playerTotal: 0,  dealerRank: 'A',  isPair: false, isSoft: false, threshold: 3,   deviationAction: 'insurance', basicAction: 'no_insurance', direction: 'gte' },
  { id: 2,  label: '16 vs 10',          playerTotal: 16, dealerRank: '10', isPair: false, isSoft: false, threshold: 0,   deviationAction: 'stand',     basicAction: 'hit',          direction: 'gte' },
  { id: 3,  label: '15 vs 10',          playerTotal: 15, dealerRank: '10', isPair: false, isSoft: false, threshold: 4,   deviationAction: 'stand',     basicAction: 'hit',          direction: 'gte' },
  { id: 4,  label: '10,10 vs 5',        playerTotal: 20, dealerRank: '5',  isPair: true,  isSoft: false, threshold: 5,   deviationAction: 'split',     basicAction: 'stand',        direction: 'gte' },
  { id: 5,  label: '10,10 vs 6',        playerTotal: 20, dealerRank: '6',  isPair: true,  isSoft: false, threshold: 4,   deviationAction: 'split',     basicAction: 'stand',        direction: 'gte' },
  { id: 6,  label: '10 vs 10',          playerTotal: 10, dealerRank: '10', isPair: false, isSoft: false, threshold: 4,   deviationAction: 'double',    basicAction: 'hit',          direction: 'gte' },
  { id: 7,  label: '12 vs 3',           playerTotal: 12, dealerRank: '3',  isPair: false, isSoft: false, threshold: 2,   deviationAction: 'stand',     basicAction: 'hit',          direction: 'gte' },
  { id: 8,  label: '12 vs 2',           playerTotal: 12, dealerRank: '2',  isPair: false, isSoft: false, threshold: 3,   deviationAction: 'stand',     basicAction: 'hit',          direction: 'gte' },
  { id: 9,  label: '11 vs A',           playerTotal: 11, dealerRank: 'A',  isPair: false, isSoft: false, threshold: 1,   deviationAction: 'double',    basicAction: 'hit',          direction: 'gte' },
  { id: 10, label: '9 vs 2',            playerTotal: 9,  dealerRank: '2',  isPair: false, isSoft: false, threshold: 1,   deviationAction: 'double',    basicAction: 'hit',          direction: 'gte' },
  { id: 11, label: '10 vs A',           playerTotal: 10, dealerRank: 'A',  isPair: false, isSoft: false, threshold: 4,   deviationAction: 'double',    basicAction: 'hit',          direction: 'gte' },
  { id: 12, label: '9 vs 7',            playerTotal: 9,  dealerRank: '7',  isPair: false, isSoft: false, threshold: 3,   deviationAction: 'double',    basicAction: 'hit',          direction: 'gte' },
  { id: 13, label: '16 vs 9',           playerTotal: 16, dealerRank: '9',  isPair: false, isSoft: false, threshold: 5,   deviationAction: 'stand',     basicAction: 'hit',          direction: 'gte' },
  { id: 14, label: '13 vs 2',           playerTotal: 13, dealerRank: '2',  isPair: false, isSoft: false, threshold: -1,  deviationAction: 'stand',     basicAction: 'stand',        direction: 'gte' },
  { id: 15, label: '12 vs 4',           playerTotal: 12, dealerRank: '4',  isPair: false, isSoft: false, threshold: 0,   deviationAction: 'stand',     basicAction: 'stand',        direction: 'gte' },
  { id: 16, label: '12 vs 5',           playerTotal: 12, dealerRank: '5',  isPair: false, isSoft: false, threshold: -2,  deviationAction: 'stand',     basicAction: 'stand',        direction: 'gte' },
  { id: 17, label: '12 vs 6',           playerTotal: 12, dealerRank: '6',  isPair: false, isSoft: false, threshold: -1,  deviationAction: 'stand',     basicAction: 'stand',        direction: 'gte' },
  { id: 18, label: '13 vs 3',           playerTotal: 13, dealerRank: '3',  isPair: false, isSoft: false, threshold: -2,  deviationAction: 'stand',     basicAction: 'stand',        direction: 'gte' },
];

/**
 * Check if the current hand situation matches any Illustrious 18 deviation.
 * @param {Array} playerCards - player's cards
 * @param {Object} dealerUpcard - dealer's face-up card
 * @param {number} tc - current true count
 * @param {boolean} isInsurance - whether this is an insurance decision
 * @returns {{ deviation: object|null, shouldDeviate: boolean, deviationAction: string|null }}
 */
export function checkDeviation(playerCards, dealerUpcard, tc, isInsurance = false) {
  if (isInsurance) {
    const dev = ILLUSTRIOUS_18[0]; // Insurance deviation
    const shouldDeviate = tc >= dev.threshold;
    return {
      deviation: dev,
      shouldDeviate,
      deviationAction: shouldDeviate ? 'insurance' : 'no_insurance',
    };
  }

  if (!playerCards || playerCards.length < 2 || !dealerUpcard) {
    return { deviation: null, shouldDeviate: false, deviationAction: null };
  }

  const total = handTotal(playerCards);
  const soft = isSoft(playerCards);
  const pair = canSplit(playerCards);
  const dealerRank = getDealerRank(dealerUpcard);

  for (const dev of ILLUSTRIOUS_18) {
    if (dev.id === 1) continue; // Skip insurance, handled above

    // Match conditions
    if (dev.playerTotal !== total) continue;
    if (dev.dealerRank !== dealerRank) continue;
    if (dev.isPair && !pair) continue;
    if (dev.isSoft && !soft) continue;
    if (!dev.isPair && pair && (dev.playerTotal === 20)) continue; // Don't match 10,10 deviation for non-pair 20

    const shouldDeviate = tc >= dev.threshold;
    return {
      deviation: dev,
      shouldDeviate,
      deviationAction: shouldDeviate ? dev.deviationAction : dev.basicAction,
    };
  }

  return { deviation: null, shouldDeviate: false, deviationAction: null };
}

function getDealerRank(upcard) {
  if (['J', 'Q', 'K', '10'].includes(upcard.rank)) return '10';
  return upcard.rank;
}

/**
 * Check if a player's action was correct considering deviations.
 * @param {string} playerAction - what the player did
 * @param {Array} playerCards - player's cards
 * @param {Object} dealerUpcard - dealer's face-up card
 * @param {number} tc - current true count
 * @returns {{ isDeviation: boolean, correct: boolean, deviationLabel: string|null }}
 */
export function checkDeviationPlay(playerAction, playerCards, dealerUpcard, tc) {
  const result = checkDeviation(playerCards, dealerUpcard, tc);

  if (!result.deviation) {
    return { isDeviation: false, correct: true, deviationLabel: null };
  }

  const correct = playerAction === result.deviationAction;
  return {
    isDeviation: true,
    correct,
    deviationLabel: result.deviation.label,
    recommended: result.deviationAction,
  };
}
