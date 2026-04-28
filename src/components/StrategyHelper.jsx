import React, { useState } from 'react';
import { getBasicStrategy, actionLabel } from '../utils/strategy';
import { checkDeviation } from '../utils/deviations';

export default function StrategyHelper({ playerCards, dealerUpcard, trueCount, helperMode = 'off', deviationAlerts }) {
  const [revealed, setRevealed] = useState(false);

  if (helperMode === 'off' || !playerCards || playerCards.length < 2 || !dealerUpcard) return null;

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

  if (helperMode === 'hints') {
    if (!revealed) {
      return (
        <div className="flex justify-center py-1.5">
          <button
            onClick={() => setRevealed(true)}
            className="glass px-5 py-2 rounded-full text-sm font-medium text-gray-400 active:text-white active:bg-white/10 transition-colors"
          >
            Show Hint
          </button>
        </div>
      );
    }
  }

  return (
    <div className="flex justify-center py-1.5 animate-fade-in">
      <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
        isDeviation
          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
          : 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
      }`}>
        <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm1-4c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1z" />
        </svg>
        {actionLabel(recommended)}
        {isDeviation && <span className="text-[10px] opacity-70">(I18: {deviationLabel})</span>}
      </div>
    </div>
  );
}
