import React from 'react';
import ScreenTransition from './ScreenTransition';
import { SuitIcon } from './Card';

export default function SetupScreen({ numPlayers, onSetPlayers, onStart, onBack }) {
  return (
    <ScreenTransition>
      <div className="flex flex-col items-center justify-center h-full px-6 bg-gradient-to-b from-casino-black via-casino-slate to-casino-black">
        {onBack && (
          <div className="absolute top-4 left-4">
            <button onClick={onBack} className="text-gray-400 text-sm font-medium active:text-white transition-colors">
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} className="inline mr-1"><path d="M15 18l-6-6 6-6" /></svg>
              Menu
            </button>
          </div>
        )}

        <div className="text-center mb-10">
          <div className="flex justify-center gap-1.5 mb-3 opacity-30">
            {['♠','♥','♣','♦'].map(s => (
              <SuitIcon key={s} suit={s} size={14} />
            ))}
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Blackjack</h1>
          <h2 className="text-base text-gold font-semibold tracking-wide mt-0.5">Card Counter Trainer</h2>
          <p className="text-[11px] text-gray-500 mt-2 tracking-widest uppercase">Hi-Lo System &bull; 2-Deck Shoe</p>
        </div>

        <div className="w-full max-w-xs">
          <label className="block text-gray-400 text-sm font-medium mb-3 text-center">
            Players at table
          </label>

          {/* Table arc visualization */}
          <div className="relative h-20 mb-6">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-16 border-2 border-emerald-700/30 rounded-t-[50%]" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-3">
              {[1, 2, 3, 4, 5, 6, 7].map(n => (
                <button
                  key={n}
                  onClick={() => onSetPlayers(n)}
                  className={`w-9 h-9 rounded-full font-bold text-sm transition-all duration-200
                    ${n === numPlayers
                      ? 'bg-gold text-casino-black shadow-glow-gold scale-110'
                      : n <= numPlayers
                        ? 'bg-emerald-700/40 text-emerald-300 border border-emerald-600/30'
                        : 'bg-white/5 text-gray-500 border border-white/10'
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full py-4 bg-gradient-to-b from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-2xl
                       shadow-lg shadow-emerald-500/20 active:scale-[0.96] transition-all border border-emerald-400/20"
          >
            Start Game
          </button>
        </div>

        <div className="mt-10">
          <div className="section-card px-5 py-3">
            <div className="text-[10px] text-gray-500 text-center mb-2 uppercase tracking-widest">Hi-Lo Count Values</div>
            <div className="flex gap-6 text-xs font-medium">
              <span className="text-emerald-400">2-6: +1</span>
              <span className="text-gray-500">7-9: 0</span>
              <span className="text-red-400">10-A: -1</span>
            </div>
          </div>
        </div>
      </div>
    </ScreenTransition>
  );
}
