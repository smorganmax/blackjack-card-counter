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
        <button onClick={onBack} className="text-gray-400 text-sm px-3 py-1.5 rounded-full bg-black/20 active:bg-black/40">← Menu</button>
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
          <div className="text-yellow-400 text-sm mb-4 bg-black/20 px-4 py-2 rounded-full animate-pulse">{message}</div>
        )}

        {/* Chips display */}
        <div className="text-center mb-5">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Your Chips</div>
          <div className="text-4xl font-extrabold text-yellow-400">💰 ${chips}</div>
        </div>

        {/* Bet coaching */}
        <BetCoachIndicator trueCount={trueCount || 0} currentBet={currentBet} enabled={settings?.betCoaching} />

        <div className="text-gray-300 text-sm font-medium mb-3">Place Your Bet</div>

        {/* Bet chips */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-5 max-w-xs">
          {BET_OPTIONS.map(amount => (
            <button
              key={amount}
              onClick={() => onSetBet(amount)}
              disabled={amount > chips}
              className={`w-14 h-14 rounded-full font-bold text-xs transition-all shadow-md
                ${amount === currentBet
                  ? 'bg-yellow-500 text-black shadow-yellow-500/40 scale-110 ring-2 ring-yellow-400'
                  : amount > chips
                    ? 'bg-slate-800 text-gray-600 cursor-not-allowed opacity-40'
                    : 'bg-slate-600 text-white hover:bg-slate-500 active:scale-95'
                }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Current bet display */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-gray-400 text-sm">Current bet:</span>
          <span className="text-2xl font-extrabold text-white">${currentBet}</span>
        </div>

        <button
          onClick={onDeal}
          disabled={currentBet > chips}
          className="w-full max-w-xs py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xl
                     rounded-2xl shadow-lg shadow-emerald-500/30 active:scale-95 transition-all
                     disabled:bg-gray-700 disabled:text-gray-500 disabled:shadow-none"
        >
          Deal 🃏
        </button>
      </div>
    </div>
  );
}
