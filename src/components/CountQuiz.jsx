import React, { useState } from 'react';
import Hand from './Hand';

export default function CountQuiz({
  dealerHand,
  playerHands,
  runningCount,
  trueCount,
  roundResults,
  onSubmit,
  onSkip
}) {
  const [guess, setGuess] = useState('');

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
    <div className="flex flex-col h-full bg-gradient-to-b from-felt-dark to-felt">
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
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-xl font-bold text-white mb-2">What's the Running Count?</div>
        <p className="text-sm text-gray-400 mb-6">Think about all cards dealt this shoe</p>

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
