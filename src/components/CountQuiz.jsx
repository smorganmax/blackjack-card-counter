import React, { useState } from 'react';
import Hand from './Hand';
import { hiLoValue } from '../utils/counting';

export default function CountQuiz({
  dealerHand,
  playerHands,
  dealtCards = [],
  runningCount,
  trueCount,
  roundResults,
  onSubmit,
  onSkip
}) {
  const [guess, setGuess] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess === '' || guess === '-') return;
    onSubmit(guess);
  };

  const adjustGuess = (delta) => {
    const current = guess === '' || guess === '-' ? 0 : parseInt(guess, 10);
    setGuess(String(current + delta));
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-felt-dark to-felt overflow-y-auto">
      {/* Show hands */}
      <div className="flex justify-center gap-6 pt-4 pb-2">
        <Hand cards={dealerHand} label="Dealer" small />
        {playerHands.map((hand, i) => (
          <Hand key={i} cards={hand.cards} label="You" small />
        ))}
      </div>

      {/* Results summary */}
      <div className="flex justify-center gap-3 py-2">
        {roundResults.map((r, i) => (
          <span
            key={i}
            className={`text-sm font-bold px-3 py-1 rounded-full ${
              r.result === 'win' || r.result === 'blackjack'
                ? 'bg-emerald-500/20 text-emerald-400'
                : r.result === 'lose' || r.result === 'bust'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {r.result.toUpperCase()} {r.payout >= 0 ? `+$${r.payout}` : `-$${Math.abs(r.payout)}`}
          </span>
        ))}
      </div>

      {/* Quiz */}
      <div className="flex flex-col items-center px-6 pt-4 pb-2">
        <div className="text-xl font-bold text-white mb-1">What's the Running Count?</div>
        <p className="text-sm text-gray-400 mb-4">Think about all {dealtCards.length} cards dealt this shoe</p>

        {/* Hint: dealt cards with values */}
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="text-xs text-blue-400 underline mb-3 active:opacity-70"
        >
          {showHint ? 'Hide hint ▲' : 'Show dealt cards ▼'}
        </button>

        {showHint && dealtCards.length > 0 && (
          <div className="w-full max-w-sm bg-black/30 rounded-xl p-3 mb-4">
            <div className="flex flex-wrap gap-1 justify-center">
              {dealtCards.map((card, i) => {
                const val = hiLoValue(card);
                return (
                  <span
                    key={i}
                    className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                      val > 0 ? 'bg-emerald-500/25 text-emerald-400' :
                      val < 0 ? 'bg-red-500/25 text-red-400' :
                      'bg-gray-500/25 text-gray-400'
                    }`}
                  >
                    {card.rank}{card.suit}&nbsp;{val > 0 ? '+1' : val < 0 ? '-1' : ' 0'}
                  </span>
                );
              })}
            </div>
            <div className="text-xs text-gray-500 text-right mt-2">
              2–6 = <span className="text-emerald-400">+1</span> &nbsp;
              7–9 = <span className="text-gray-400">0</span> &nbsp;
              10–A = <span className="text-red-400">-1</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-xs">
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              type="button"
              onClick={() => adjustGuess(-1)}
              className="w-12 h-12 rounded-full bg-slate-700 text-white font-bold text-xl active:scale-95"
            >
              -
            </button>
            <input
              type="number"
              inputMode="numeric"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="0"
              className="w-24 h-14 text-center text-2xl font-bold bg-slate-800 text-white rounded-xl
                         border-2 border-slate-600 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => adjustGuess(1)}
              className="w-12 h-12 rounded-full bg-slate-700 text-white font-bold text-xl active:scale-95"
            >
              +
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl
                       active:scale-95 transition-all mb-3"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 font-medium rounded-xl
                       active:scale-95 transition-all"
          >
            Skip
          </button>
        </form>
      </div>
    </div>
  );
}
