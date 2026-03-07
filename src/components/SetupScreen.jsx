import React from 'react';

export default function SetupScreen({ numPlayers, onSetPlayers, onStart, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-gradient-to-b from-slate-900 to-slate-800">
      {onBack && (
        <div className="absolute top-4 left-4">
          <button onClick={onBack} className="text-gray-400 text-sm">&larr; Menu</button>
        </div>
      )}
      <div className="text-center mb-10 slide-up">
        <h1 className="text-4xl font-bold text-white mb-2">Blackjack</h1>
        <h2 className="text-xl text-emerald-400 font-medium">Card Counter Trainer</h2>
        <p className="text-sm text-gray-400 mt-3">Hi-Lo System &bull; 2-Deck Shoe</p>
      </div>

      <div className="w-full max-w-xs slide-up">
        <label className="block text-gray-300 text-sm font-medium mb-3 text-center">
          Players at table (including you)
        </label>
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6, 7].map(n => (
            <button
              key={n}
              onClick={() => onSetPlayers(n)}
              className={`w-11 h-11 rounded-full font-bold text-lg transition-all
                ${n === numPlayers
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg rounded-xl
                     shadow-lg shadow-emerald-500/30 active:scale-95 transition-all"
        >
          Start Game
        </button>
      </div>

      <div className="mt-10 text-center">
        <div className="text-xs text-gray-500 mb-2">Hi-Lo Count Values</div>
        <div className="flex gap-4 text-sm">
          <span className="text-emerald-400">2-6: +1</span>
          <span className="text-gray-400">7-9: 0</span>
          <span className="text-red-400">10-A: -1</span>
        </div>
      </div>
    </div>
  );
}
