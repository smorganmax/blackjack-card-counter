import React from 'react';
import { shoeProgress } from '../utils/counting';
import BetCoachIndicator from './BetCoachIndicator';

const BET_OPTIONS = [5, 10, 20, 40, 60, 80, 100];

export default function BettingScreen({ currentBet, chips, shoeSize, trueCount, settings, onSetBet, onDeal, onBack, message }) {
  const progress = shoeProgress(shoeSize);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-felt-dark to-felt">
      {/* Top bar */}
      <div className="px-4 pt-3 flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 text-sm">&larr; Menu</button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{progress}% dealt</span>
          <div className="w-16 h-1.5 bg-black/30 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {message && (
          <div className="text-yellow-400 text-sm mb-4 animate-pulse">{message}</div>
        )}

        <div className="text-gray-300 text-sm mb-1">Your Chips</div>
        <div className="text-3xl font-bold text-yellow-400 mb-6">${chips}</div>

        {/* Bet coaching */}
        <BetCoachIndicator trueCount={trueCount || 0} currentBet={currentBet} enabled={settings?.betCoaching} />

        <div className="text-gray-300 text-sm mb-3">Place Your Bet</div>

        <div className="flex flex-wrap justify-center gap-2 mb-4 max-w-xs">
          {BET_OPTIONS.map(amount => (
            <button
              key={amount}
              onClick={() => onSetBet(amount)}
              disabled={amount > chips}
              className={`w-12 h-12 rounded-full font-bold text-xs transition-all
                ${amount === currentBet
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30 scale-110'
                  : amount > chips
                    ? 'bg-slate-700 text-gray-600 cursor-not-allowed'
                    : 'bg-slate-700 text-white hover:bg-slate-600 active:scale-95'
                }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        <div className="text-2xl font-bold text-white mb-6">Bet: ${currentBet}</div>

        <button
          onClick={onDeal}
          disabled={currentBet > chips}
          className="w-full max-w-xs py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg
                     rounded-xl shadow-lg shadow-emerald-500/30 active:scale-95 transition-all
                     disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Deal
        </button>
      </div>
    </div>
  );
}
