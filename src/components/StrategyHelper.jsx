import React from 'react';
import { getBasicStrategy, actionLabel } from '../utils/strategy';
import { checkDeviation } from '../utils/deviations';

export default function StrategyHelper({ playerCards, dealerUpcard, trueCount, enabled, deviationAlerts }) {
  if (!enabled || !playerCards || playerCards.length < 2 || !dealerUpcard) return null;

  const strat = getBasicStrategy(playerCards, dealerUpcard);
  if (!strat) return null;

  let recommended = strat.action;
  let isDeviation = false;
  let deviationLabel = null;

  if (deviationAlerts) {
    const dev = checkDeviation(playerCards, dealerUpcard, trueCount);
    if (dev.deviation && dev.shouldDeviate) {
      recommended = dev.deviationAction;
      isDeviation = true;
      deviationLabel = dev.deviation.label;
    }
  }

  return (
    <div className="flex justify-center py-1">
      <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${
        isDeviation
          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
      }`}>
        {isDeviation ? '⚡ ' : '💡 '}
        {actionLabel(recommended)}
        {isDeviation && <span className="text-xs ml-1 opacity-75">(I18: {deviationLabel})</span>}
      </div>
    </div>
  );
}
