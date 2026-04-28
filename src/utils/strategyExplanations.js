import { handTotal } from './hand';

const EXPLANATIONS = {
  'hard_8_vs_5': 'With 8 vs a weak dealer 5, hit. Your total is too low to stand, and doubling only works with 9-11.',
  'hard_8_vs_6': 'With 8 vs a weak dealer 6, hit. Your total is too low to stand, and doubling only works with 9-11.',
  'hard_9_vs_2': 'With 9 vs dealer 2, hitting is safer. The dealer\'s 2 isn\'t weak enough to justify the risk of doubling.',
  'hard_9_vs_3': 'Double down! Dealer 3-6 are bust cards. Your 9 plus a 10 gives you 19.',
  'hard_9_vs_4': 'Double down! Dealer 4 busts often, and your 9 has good odds of reaching 19.',
  'hard_9_vs_5': 'Double down! Dealer 5 is the second-weakest upcard. Maximize your bet.',
  'hard_9_vs_6': 'Double down! Dealer 6 is the weakest upcard. This is a profitable double.',
  'hard_10_vs_10': 'Hit, don\'t double. The dealer\'s 10 is strong — too risky to double into.',
  'hard_10_vs_A': 'Hit, don\'t double. Against an ace, the dealer is too strong for doubling.',
  'hard_11_vs_any': 'Double down on 11! This is the best doubling hand — high chance of reaching 21.',
  'hard_12_vs_2': 'Hit. Dealer 2 isn\'t weak enough to stand on 12. You\'ll bust only 31% of the time hitting.',
  'hard_12_vs_3': 'Hit. Dealer 3 isn\'t weak enough to stand on 12. The risk of busting (31%) is less than the cost of standing.',
  'hard_12_vs_4': 'Stand. Dealer 4-6 bust often enough that you should avoid the 31% bust risk.',
  'hard_12_vs_5': 'Stand. Dealer 5 busts ~43% of the time. Let the dealer take the risk.',
  'hard_12_vs_6': 'Stand. Dealer 6 busts ~42% of the time. Standing is clearly better here.',
  'hard_12_vs_high': 'Hit. Against dealer 7+, standing on 12 is losing too much. You need to improve.',
  'hard_13_vs_low': 'Stand vs dealer 2-6. The dealer is likely to bust, so avoid your own bust risk.',
  'hard_13_vs_high': 'Hit vs dealer 7+. Standing on 13 vs a strong upcard loses more than hitting.',
  'hard_14_vs_low': 'Stand vs dealer 2-6. Let the dealer bust.',
  'hard_14_vs_high': 'Hit vs dealer 7+. 14 can\'t beat a dealer who makes their hand.',
  'hard_15_vs_low': 'Stand vs dealer 2-6. The dealer busts often enough to make standing correct.',
  'hard_15_vs_high': 'Hit vs dealer 7+. Standing on 15 vs strong upcards loses more money long-term.',
  'hard_15_vs_10': 'Hit (or surrender if available). 15 vs 10 is one of the worst hands in blackjack.',
  'hard_16_vs_low': 'Stand vs dealer 2-6. 16 is terrible, but the dealer busts often enough.',
  'hard_16_vs_high': 'Hit vs dealer 7+. 16 is the worst hand, but standing loses even more.',
  'hard_16_vs_10': 'Hit (or surrender). You bust 62% hitting, but the dealer makes a hand 77% if you stand.',
  'hard_17_plus': 'Always stand on 17+. The risk of busting is too high to justify hitting.',
  'soft_13_14': 'Hit soft 13-14. These hands are too weak to stand, and you can\'t bust with one more card.',
  'soft_15_16': 'Hit soft 15-16. You need to improve, and the ace protects you from busting.',
  'soft_17_vs_low': 'Double soft 17 vs dealer 3-6. One card with a chance to improve, against a weak dealer.',
  'soft_17_vs_high': 'Hit soft 17. Standing on 17 is losing long-term; the ace gives you a safe hit.',
  'soft_18_vs_2_6': 'Double soft 18 vs dealer 2-6! Doubling against weak dealers makes more money than standing.',
  'soft_18_vs_7_8': 'Stand soft 18 vs dealer 7-8. 18 is strong enough against these upcards.',
  'soft_18_vs_9_A': 'Hit soft 18 vs dealer 9-A. 18 isn\'t strong enough — try to improve since you can\'t bust.',
  'soft_19_plus': 'Stand (or double soft 19 vs 6). 19-20 are strong hands.',
  'pair_A': 'Always split aces! Two chances at 21 is much better than one hand of 12.',
  'pair_8': 'Always split 8s! Two hands from 8 beat playing 16 (the worst total).',
  'pair_10': 'Never split 10s! 20 is the second-best hand. Don\'t break up a winner.',
  'pair_9_vs_7': 'Stand with 9,9 vs 7. Your 18 beats the dealer\'s likely 17.',
  'pair_9_vs_low': 'Split 9s vs dealer 2-6. Two hands from 9 vs a weak dealer is very profitable.',
  'pair_9_vs_high': 'Stand with 9,9 vs 10/A. 18 is decent against strong upcards — don\'t risk it.',
  'pair_7': 'Split 7s vs dealer 2-7. Against weak/medium upcards, two 7s have potential.',
  'pair_6': 'Split 6s vs dealer 2-6 only. Against 7+, just hit your 12.',
  'pair_5': 'Never split 5s! Treat it as a hard 10 and double down.',
  'pair_4': 'Generally hit 4,4. Split only vs 5-6 if double after split is allowed.',
  'pair_3_2': 'Split 2s and 3s vs dealer 2-7. Low pairs improve by splitting against weak upcards.',
  'deviation_insurance': 'Insurance is normally -EV. But at TC +3, the remaining deck has enough 10s to make it profitable.',
  'deviation_16v10': 'Basic strategy says hit 16 vs 10. At TC 0+, enough high cards remain to make standing better.',
  'deviation_15v10': 'At TC +4, the deck is rich enough in 10s that standing on 15 vs 10 becomes correct.',
  'deviation_12v2': 'Normally hit 12 vs 2. At TC +3, the high-card-rich deck makes hitting too dangerous.',
  'deviation_12v3': 'Normally hit 12 vs 3. At TC +2, stand instead — too many bust cards in the deck.',
};

function getHandKey(playerCards, dealerUpcard, handType) {
  const total = handTotal(playerCards);
  const dealerRank = dealerUpcard?.rank;
  const dv = ['10','J','Q','K'].includes(dealerRank) ? '10' : dealerRank;
  const isLow = ['2','3','4','5','6'].includes(dv);

  if (handType === 'pair') {
    const pairRank = playerCards[0]?.rank;
    const pk = ['10','J','Q','K'].includes(pairRank) ? '10' : pairRank;
    if (pk === 'A') return 'pair_A';
    if (pk === '8') return 'pair_8';
    if (pk === '10') return 'pair_10';
    if (pk === '9') {
      if (dv === '7') return 'pair_9_vs_7';
      return isLow ? 'pair_9_vs_low' : 'pair_9_vs_high';
    }
    if (pk === '7') return 'pair_7';
    if (pk === '6') return 'pair_6';
    if (pk === '5') return 'pair_5';
    if (pk === '4') return 'pair_4';
    return 'pair_3_2';
  }

  if (handType === 'soft') {
    if (total <= 14) return 'soft_13_14';
    if (total <= 16) return 'soft_15_16';
    if (total === 17) return isLow ? 'soft_17_vs_low' : 'soft_17_vs_high';
    if (total === 18) {
      if (isLow) return 'soft_18_vs_2_6';
      if (dv === '7' || dv === '8') return 'soft_18_vs_7_8';
      return 'soft_18_vs_9_A';
    }
    return 'soft_19_plus';
  }

  if (total >= 17) return 'hard_17_plus';
  if (total === 16) {
    if (dv === '10') return 'hard_16_vs_10';
    return isLow ? 'hard_16_vs_low' : 'hard_16_vs_high';
  }
  if (total === 15) {
    if (dv === '10') return 'hard_15_vs_10';
    return isLow ? 'hard_15_vs_low' : 'hard_15_vs_high';
  }
  if (total === 14) return isLow ? 'hard_14_vs_low' : 'hard_14_vs_high';
  if (total === 13) return isLow ? 'hard_13_vs_low' : 'hard_13_vs_high';
  if (total === 12) {
    if (dv === '2') return 'hard_12_vs_2';
    if (dv === '3') return 'hard_12_vs_3';
    if (['4','5','6'].includes(dv)) return `hard_12_vs_${dv}`;
    return 'hard_12_vs_high';
  }
  if (total === 11) return 'hard_11_vs_any';
  if (total === 10) {
    if (dv === '10') return 'hard_10_vs_10';
    if (dv === 'A') return 'hard_10_vs_A';
    return null;
  }
  if (total === 9) {
    const key = `hard_9_vs_${dv}`;
    return EXPLANATIONS[key] ? key : null;
  }
  return null;
}

export function getExplanation(playerCards, dealerUpcard, handType) {
  if (!playerCards || !dealerUpcard) return null;
  const key = getHandKey(playerCards, dealerUpcard, handType);
  return key ? (EXPLANATIONS[key] || null) : null;
}

export function getDeviationExplanation(deviationId) {
  const map = {
    1: EXPLANATIONS.deviation_insurance,
    2: EXPLANATIONS.deviation_16v10,
    3: EXPLANATIONS.deviation_15v10,
    8: EXPLANATIONS.deviation_12v2,
    7: EXPLANATIONS.deviation_12v3,
  };
  return map[deviationId] || 'This is an Illustrious 18 index play — a deviation from basic strategy that becomes correct at certain true counts.';
}
