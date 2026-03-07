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
    <div className="mx-4 mb-3">
      <div className={`p-3 rounded-xl border ${isOptimal ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-yellow-900/20 border-yellow-500/30'}`}>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-400">Optimal Bet (TC {trueCount >= 0 ? '+' : ''}{trueCount})</div>
            <div className={`text-lg font-bold ${isOptimal ? 'text-emerald-400' : 'text-yellow-400'}`}>
              ${rec.bet} <span className="text-xs font-normal text-gray-400">({rec.label})</span>
            </div>
          </div>
          <div className="text-2xl">
            {isOptimal ? '✓' : '⚠'}
          </div>
        </div>
      </div>
    </div>
  );
}
