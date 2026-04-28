import React, { useState } from 'react';
import ScreenTransition from './ScreenTransition';
import Hand from './Hand';
import { hiLoValue } from '../utils/counting';
import { cardLabel } from '../utils/deck';

export default function RoundResult({
  dealerHand,
  playerHands,
  roundResults,
  runningCount,
  trueCount,
  quizAnswer,
  quizSubmitted,
  stats,
  dealtCards = [],
  onNextRound,
  onBackToSetup
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const guessCorrect = quizAnswer !== null && quizAnswer === runningCount;
  const accuracy = stats.countGuesses > 0
    ? Math.round((stats.countCorrect / stats.countGuesses) * 100)
    : 0;

  const thisRoundCards = [];
  const allHands = [...(dealerHand || [])];
  playerHands.forEach(h => allHands.push(...h.cards));

  return (
    <ScreenTransition>
      <div className="flex flex-col h-full bg-gradient-to-b from-casino-black to-casino-slate overflow-y-auto hide-scrollbar">
        {/* Hands */}
        <div className="flex justify-center gap-5 pt-4 pb-2">
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
              className={`text-xs font-bold px-3 py-1 rounded-full animate-pop-in ${
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

        {/* Count feedback */}
        <div className="mx-4 mt-3 section-card">
          <div className="text-center mb-2">
            <div className="text-[10px] text-gray-500 uppercase tracking-wide">Running Count</div>
            <div className={`text-3xl font-bold tabular-nums ${runningCount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {runningCount > 0 ? '+' : ''}{runningCount}
            </div>
            <div className="text-xs text-gray-500 mt-1 tabular-nums">
              True Count: {trueCount > 0 ? '+' : ''}{trueCount}
            </div>
          </div>

          {quizAnswer !== null && (
            <div className={`text-center mt-2 p-2.5 rounded-xl animate-pop-in ${guessCorrect ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
              <span className={`font-bold ${guessCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                {guessCorrect ? 'Correct!' : `Wrong — you guessed ${quizAnswer}`}
              </span>
            </div>
          )}

          <div className="text-center mt-2 text-[11px] text-gray-500 tabular-nums">
            Count Accuracy: {accuracy}% ({stats.countCorrect}/{stats.countGuesses})
          </div>

          {/* Count breakdown toggle */}
          {dealtCards.length > 0 && (
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full mt-3 py-2 text-xs text-blue-400 font-medium active:text-blue-300 border-t border-white/5"
            >
              {showBreakdown ? 'Hide' : 'Show'} Card-by-Card Breakdown
            </button>
          )}

          {showBreakdown && dealtCards.length > 0 && (
            <div className="mt-2 animate-fade-in">
              <div className="flex flex-wrap gap-1.5 justify-center">
                {dealtCards.map((card, i) => {
                  const val = hiLoValue(card);
                  return (
                    <div key={i} className="flex items-center gap-0.5 bg-white/5 rounded-lg px-1.5 py-1">
                      <span className="text-[10px] text-gray-300 font-medium">{cardLabel(card)}</span>
                      <span className={`text-[10px] font-bold ${
                        val > 0 ? 'text-emerald-400' : val < 0 ? 'text-red-400' : 'text-gray-500'
                      }`}>
                        {val > 0 ? '+1' : val < 0 ? '-1' : '0'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="text-center mt-2 text-[10px] text-gray-600">
                Total: {dealtCards.reduce((s, c) => s + hiLoValue(c), 0)}
              </div>
            </div>
          )}
        </div>

        {/* Session stats */}
        <div className="mx-4 mt-3 section-card">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-[10px] text-gray-500">Hands</div>
              <div className="text-sm font-bold text-white tabular-nums">{stats.handsPlayed}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">Wins</div>
              <div className="text-sm font-bold text-emerald-400 tabular-nums">{stats.wins}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">Losses</div>
              <div className="text-sm font-bold text-red-400 tabular-nums">{stats.losses}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500">Chips</div>
              <div className={`text-sm font-bold tabular-nums ${stats.chips >= 1000 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${stats.chips}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-4 mt-auto">
          <button
            onClick={onNextRound}
            className="w-full py-4 bg-gradient-to-b from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-2xl
                       shadow-lg shadow-emerald-500/20 active:scale-[0.96] transition-all border border-emerald-400/20 mb-3"
          >
            Next Hand
          </button>
          <button
            onClick={onBackToSetup}
            className="w-full py-3 glass text-gray-400 font-medium rounded-2xl active:scale-[0.96] transition-all"
          >
            End Session
          </button>
        </div>
      </div>
    </ScreenTransition>
  );
}
