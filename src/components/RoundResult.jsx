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
  const isWin = totalPayout > 0;
  const isPush = totalPayout === 0;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-felt-dark to-felt overflow-y-auto">
      {/* Hands display */}
      <div className="flex justify-center gap-6 pt-4 pb-2 px-4">
        <Hand cards={dealerHand} label="Dealer" small />
        {playerHands.map((hand, i) => (
          <Hand key={i} cards={hand.cards} label={playerHands.length > 1 ? `Hand ${i+1}` : 'You'} small />
        ))}
      </div>

      {/* Result badges */}
      <div className="flex justify-center gap-2 pb-2 px-4">
        {roundResults.map((r, i) => (
          <span
            key={i}
            className={`text-sm font-bold px-3 py-1.5 rounded-full ${
              r.result === 'win' || r.result === 'blackjack'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : r.result === 'lose' || r.result === 'bust'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}
          >
            {r.result.toUpperCase()} {r.payout >= 0 ? `+$${r.payout}` : `-$${Math.abs(r.payout)}`}
          </span>
        ))}
      </div>

      {/* Total payout */}
      <div className="mx-4 mb-2 py-3 rounded-xl bg-black/20 text-center">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Round Result</div>
        <div className={`text-3xl font-extrabold ${isWin ? 'text-emerald-400' : isPush ? 'text-gray-300' : 'text-red-400'}`}>
          {totalPayout >= 0 ? '+' : ''}${totalPayout}
        </div>
        <div className={`text-xs font-bold mt-0.5 ${isWin ? 'text-emerald-500' : isPush ? 'text-gray-400' : 'text-red-500'}`}>
          {isWin ? '🎉 WIN' : isPush ? '🤝 PUSH' : '💸 LOSS'}
        </div>
      </div>

      {/* Count feedback */}
      <div className="mx-4 mb-2 p-3 rounded-xl bg-black/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 mb-0.5">Running Count</div>
            <div className={`text-2xl font-extrabold ${runningCount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {runningCount > 0 ? '+' : ''}{runningCount}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-0.5">True Count</div>
            <div className={`text-xl font-bold ${trueCount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trueCount > 0 ? '+' : ''}{trueCount}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-0.5">Accuracy</div>
            <div className={`text-xl font-bold ${accuracy >= 70 ? 'text-emerald-400' : accuracy >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {accuracy}%
            </div>
          </div>
        </div>

        {quizAnswer !== null && (
          <div className={`mt-2 p-2 rounded-lg text-center ${guessCorrect ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-red-500/20 border border-red-500/30'}`}
            role="status" aria-live="polite">
            <span className={`font-bold text-sm ${guessCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
              {guessCorrect ? 'Correct count!' : `Wrong — you guessed ${quizAnswer}, actual was ${runningCount}`}
            </span>
          </div>
        )}
      </div>

      {/* Session stats */}
      <div className="mx-4 mb-2 p-3 rounded-xl bg-black/20">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-[10px] text-gray-500 uppercase">Hands</div>
            <div className="text-base font-bold text-white">{stats.handsPlayed}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase">Wins</div>
            <div className="text-base font-bold text-emerald-400">{stats.wins}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase">Losses</div>
            <div className="text-base font-bold text-red-400">{stats.losses}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase">Chips</div>
            <div className={`text-base font-bold ${stats.chips >= 1000 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${stats.chips}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-4 mt-auto">
        <button
          onClick={onNextRound}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-lg rounded-2xl
                     shadow-lg shadow-emerald-500/30 active:scale-95 transition-all mb-2"
        >
          Next Hand →
        </button>
        <button
          onClick={onBackToSetup}
          className="w-full py-3 bg-slate-700/60 hover:bg-slate-700 text-gray-400 font-medium rounded-xl
                     active:scale-95 transition-all text-sm"
        >
          End Session
        </button>
      </div>
    </div>
  );
}
