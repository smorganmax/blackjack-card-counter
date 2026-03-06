import React from 'react';
import Hand from './Hand';

export default function RoundResult({
  dealerHand,
  playerHands,
  roundResults,
  runningCount,
  trueCount,
  quizAnswer,
  quizSubmitted,
  stats,
  onNextRound,
  onBackToSetup
}) {
  const guessCorrect = quizAnswer !== null && quizAnswer === runningCount;
  const accuracy = stats.countGuesses > 0
    ? Math.round((stats.countCorrect / stats.countGuesses) * 100)
    : 0;

  const totalPayout = roundResults.reduce((sum, r) => sum + r.payout, 0);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-felt-dark to-felt overflow-y-auto">
      {/* Hands */}
      <div className="flex justify-center gap-6 pt-4 pb-2">
        <Hand cards={dealerHand} label="Dealer" small />
        {playerHands.map((hand, i) => (
          <Hand key={i} cards={hand.cards} label={playerHands.length > 1 ? `Hand ${i+1}` : 'You'} small />
        ))}
      </div>

      {/* Result badges */}
      <div className="flex justify-center gap-2 py-2">
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

      {/* Count feedback */}
      <div className="mx-4 mt-3 p-4 rounded-xl bg-black/20">
        <div className="text-center mb-2">
          <div className="text-sm text-gray-400">Running Count</div>
          <div className={`text-3xl font-bold ${runningCount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {runningCount > 0 ? '+' : ''}{runningCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            True Count: {trueCount > 0 ? '+' : ''}{trueCount}
          </div>
        </div>

        {quizAnswer !== null && (
          <div className={`text-center mt-2 p-2 rounded-lg ${guessCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            <span className={`font-bold ${guessCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
              {guessCorrect ? 'Correct!' : `Wrong! You guessed ${quizAnswer}`}
            </span>
          </div>
        )}

        <div className="text-center mt-2 text-xs text-gray-500">
          Count Accuracy: {accuracy}% ({stats.countCorrect}/{stats.countGuesses})
        </div>
      </div>

      {/* Session stats */}
      <div className="mx-4 mt-3 p-3 rounded-xl bg-black/20">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-xs text-gray-500">Hands</div>
            <div className="text-sm font-bold text-white">{stats.handsPlayed}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Wins</div>
            <div className="text-sm font-bold text-emerald-400">{stats.wins}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Losses</div>
            <div className="text-sm font-bold text-red-400">{stats.losses}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Chips</div>
            <div className={`text-sm font-bold ${stats.chips >= 1000 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${stats.chips}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-4 mt-auto">
        <button
          onClick={onNextRound}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg rounded-xl
                     shadow-lg shadow-emerald-500/30 active:scale-95 transition-all mb-3"
        >
          Next Hand
        </button>
        <button
          onClick={onBackToSetup}
          className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 font-medium rounded-xl
                     active:scale-95 transition-all"
        >
          End Session
        </button>
      </div>
    </div>
  );
}
