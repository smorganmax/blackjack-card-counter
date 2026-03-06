import React from 'react';
import { shoeProgress } from '../utils/counting';

const BET_OPTIONS = [5, 10, 25, 50, 100];

export default function BettingScreen({ currentBet, chips, shoeSize, onSetBet, onDeal, message }) {
  const progress = shoeProgress(shoeSize);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-felt-dark to-felt">
      {/* Shoe progress */}
      <div className="px-4 pt-3">
        <div className="flex justify-between text-xs text-gray-300 mb-1">
          <span>Shoe Progress</span>
          <span>{progress}% dealt</span>
        </div>
        <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {message && (
          <div className="text-yellow-400 text-sm mb-4 animate-pulse">{message}</div>
        )}

        <div className="text-gray-300 text-sm mb-1">Your Chips</div>
        <div className="text-3xl font-bold text-yellow-400 mb-8">${chips}</div>

        <div className="text-gray-300 text-sm mb-3">Place Your Bet</div>

        <div className="flex gap-3 mb-6">
          {BET_OPTIONS.map(amount => (
            <button
              key={amount}
              onClick={() => onSetBet(amount)}
              disabled={amount > chips}
              className={`w-14 h-14 rounded-full font-bold text-sm transition-all
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

        <div className="text-2xl font-bold text-white mb-8">Bet: ${currentBet}</div>

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
