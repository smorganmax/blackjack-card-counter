import React from 'react';

const BET_SPREAD = [
  { minTc: -Infinity, maxTc: 0, units: 1, bet: 10, label: '1 unit' },
  { minTc: 1, maxTc: 1, units: 2, bet: 20, label: '2 units' },
  { minTc: 2, maxTc: 2, units: 4, bet: 40, label: '4 units' },
  { minTc: 3, maxTc: 3, units: 6, bet: 60, label: '6 units' },
  { minTc: 4, maxTc: 4, units: 8, bet: 80, label: '8 units' },
  { minTc: 5, maxTc: Infinity, units: 10, bet: 100, label: '10 units' },
];

export function getRecommendedBet(tc) {
  const spread = BET_SPREAD.find(s => tc >= s.minTc && tc <= s.maxTc);
  return spread || BET_SPREAD[0];
}

export function isBetOptimal(bet, tc) {
  const rec = getRecommendedBet(tc);
  return bet === rec.bet;
}

export default function BetCoachIndicator({ trueCount, currentBet, enabled }) {
  if (!enabled) return null;

  const rec = getRecommendedBet(trueCount);
  const isOptimal = currentBet === rec.bet;

  return (
    <div className="w-full max-w-xs mb-4">
      <div className={`section-card flex items-center justify-between ${
        isOptimal ? 'border-emerald-500/20' : 'border-amber-500/20'
      }`}>
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wide">
            Optimal Bet (TC {trueCount >= 0 ? '+' : ''}{trueCount})
          </div>
          <div className={`text-lg font-bold tabular-nums ${isOptimal ? 'text-emerald-400' : 'text-gold'}`}>
            ${rec.bet} <span className="text-xs font-normal text-gray-500">({rec.label})</span>
          </div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
          ${isOptimal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {isOptimal ? '✓' : '!'}
        </div>
      </div>
    </div>
  );
}
