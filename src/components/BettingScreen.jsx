import React from 'react';
import ScreenTransition from './ScreenTransition';
import { shoeProgress } from '../utils/counting';
import BetCoachIndicator from './BetCoachIndicator';

const BET_OPTIONS = [
  { amount: 5, color: 'bg-chip-red', label: '$5' },
  { amount: 10, color: 'bg-chip-blue', label: '$10' },
  { amount: 20, color: 'bg-chip-green', label: '$20' },
  { amount: 40, color: 'bg-chip-black', label: '$40' },
  { amount: 60, color: 'bg-chip-purple', label: '$60' },
  { amount: 80, color: 'bg-chip-orange', label: '$80' },
  { amount: 100, color: 'bg-chip-gold', label: '$100' },
];

export default function BettingScreen({ currentBet, chips, shoeSize, trueCount, settings, onSetBet, onDeal, onBack, message }) {
  const progress = shoeProgress(shoeSize);

  return (
    <ScreenTransition>
      <div className="flex flex-col h-full bg-gradient-to-b from-casino-black to-casino-slate">
        {/* Top bar */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <button onClick={onBack} className="text-gray-400 text-sm font-medium active:text-white transition-colors">
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} className="inline mr-1"><path d="M15 18l-6-6 6-6" /></svg>
            Menu
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500">{progress}%</span>
            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500/60 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {message && (
            <div className="text-gold text-sm mb-4 font-medium animate-fade-in">{message}</div>
          )}

          <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">Your Chips</div>
          <div className="text-4xl font-bold text-gold mb-6">${chips}</div>

          <BetCoachIndicator trueCount={trueCount || 0} currentBet={currentBet} enabled={settings?.betCoaching} />

          <div className="text-gray-500 text-xs uppercase tracking-widest mb-4">Place Your Bet</div>

          <div className="flex flex-wrap justify-center gap-3 mb-5 max-w-xs">
            {BET_OPTIONS.map(opt => {
              const selected = opt.amount === currentBet;
              const disabled = opt.amount > chips;
              return (
                <button
                  key={opt.amount}
                  onClick={() => onSetBet(opt.amount)}
                  disabled={disabled}
                  className={`chip w-[52px] h-[52px] flex items-center justify-center font-bold text-xs transition-all duration-150
                    ${selected
                      ? `${opt.color} text-white scale-110 ring-2 ring-gold/50 ring-offset-2 ring-offset-casino-black`
                      : disabled
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-40'
                        : `${opt.color} text-white/90 active:scale-95`
                    }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="text-3xl font-bold text-white mb-8">
            Bet: <span className="text-gold">${currentBet}</span>
          </div>

          <button
            onClick={onDeal}
            disabled={currentBet > chips}
            className="w-full max-w-xs py-4 bg-gradient-to-b from-emerald-500 to-emerald-600 text-white font-bold text-lg
                       rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.96] transition-all border border-emerald-400/20
                       disabled:from-gray-700 disabled:to-gray-800 disabled:shadow-none disabled:border-gray-600/20 disabled:text-gray-500"
          >
            Deal
          </button>
        </div>
      </div>
    </ScreenTransition>
  );
}
