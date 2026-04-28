import React, { useState } from 'react';
import ScreenTransition from './ScreenTransition';
import Hand from './Hand';
import { hiLoValue } from '../utils/counting';
import { cardLabel } from '../utils/deck';

export default function CountQuiz({
  dealerHand,
  playerHands,
  otherPlayers = [],
  runningCount,
  trueCount,
  roundResults,
  dealtCards = [],
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
    <ScreenTransition>
      <div className="flex flex-col h-full bg-gradient-to-b from-casino-black to-casino-slate">
        {/* Show hands */}
        <div className="flex justify-center gap-5 pt-4 pb-2">
          <Hand cards={dealerHand} label="Dealer" small />
          {playerHands.map((hand, i) => (
            <Hand key={i} cards={hand.cards} label="You" small />
          ))}
        </div>

        {/* Results summary */}
        <div className="flex justify-center gap-2 py-2">
          {roundResults.map((r, i) => (
            <span
              key={i}
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                r.result === 'win' || r.result === 'blackjack'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : r.result === 'lose' || r.result === 'bust'
                    ? 'bg-red-500/15 text-red-400'
                    : 'bg-white/5 text-gray-400'
              }`}
            >
              {r.result.toUpperCase()} {r.payout >= 0 ? `+$${r.payout}` : `-$${Math.abs(r.payout)}`}
            </span>
          ))}
        </div>

        {/* Quiz */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-xl font-bold text-white mb-1">What's the Running Count?</div>
          <p className="text-xs text-gray-500 mb-1">Think about all cards dealt this shoe</p>
          <p className="text-[10px] text-gray-600 mb-6">
            Low (2-6) = <span className="text-emerald-400">+1</span> &bull; Neutral (7-9) = <span className="text-gray-400">0</span> &bull; High (10-A) = <span className="text-red-400">-1</span>
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-xs">
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => adjustGuess(-1)}
                className="w-12 h-12 rounded-full glass text-white font-bold text-xl active:scale-95 active:bg-white/10"
              >
                -
              </button>
              <input
                type="number"
                inputMode="numeric"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="0"
                className="w-24 h-14 text-center text-2xl font-bold bg-casino-surface text-white rounded-2xl
                           border-2 border-white/10 focus:border-blue-500 focus:outline-none tabular-nums"
              />
              <button
                type="button"
                onClick={() => adjustGuess(1)}
                className="w-12 h-12 rounded-full glass text-white font-bold text-xl active:scale-95 active:bg-white/10"
              >
                +
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold text-lg rounded-2xl
                         active:scale-[0.96] shadow-lg border border-blue-400/20 transition-all mb-3"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="w-full py-3 glass text-gray-400 font-medium rounded-2xl active:scale-[0.96] transition-all"
            >
              Skip
            </button>
          </form>
        </div>
      </div>
    </ScreenTransition>
  );
}
