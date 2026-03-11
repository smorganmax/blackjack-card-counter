import React, { useState } from 'react';

const CARD_GROUPS = [
  { ranks: ['2', '3', '4', '5', '6'], value: 1, label: 'Low Cards — dealer busts more often', color: 'text-emerald-400', bg: 'bg-emerald-500/15', badge: '+1' },
  { ranks: ['7', '8', '9'], value: 0, label: 'Neutral Cards — no effect', color: 'text-gray-400', bg: 'bg-gray-500/15', badge: '0' },
  { ranks: ['10', 'J', 'Q', 'K', 'A'], value: -1, label: 'High Cards — good for dealer', color: 'text-red-400', bg: 'bg-red-500/15', badge: '-1' },
];

const BET_SPREAD = [
  { tc: '≤ 0', bet: '1× ($10)', color: 'text-red-400' },
  { tc: '+1', bet: '2× ($20)', color: 'text-yellow-400' },
  { tc: '+2', bet: '4× ($40)', color: 'text-yellow-300' },
  { tc: '+3', bet: '6× ($60)', color: 'text-emerald-400' },
  { tc: '+4', bet: '8× ($80)', color: 'text-emerald-300' },
  { tc: '≥ +5', bet: '10× ($100)', color: 'text-emerald-200' },
];

const EXAMPLE = [
  { rank: '5', suit: '♥', value: 1 },
  { rank: 'K', suit: '♠', value: -1 },
  { rank: '7', suit: '♦', value: 0 },
  { rank: '3', suit: '♣', value: 1 },
  { rank: 'A', suit: '♥', value: -1 },
  { rank: '6', suit: '♠', value: 1 },
  { rank: '9', suit: '♦', value: 0 },
  { rank: '2', suit: '♣', value: 1 },
];

const TIPS = [
  { icon: '🔄', text: "Cancellation trick: A low card and a high card cancel out (+1 −1 = 0). Spot pairs to count faster." },
  { icon: '👁️', text: "Count ALL visible cards — yours, the dealer's, and every other player at the table." },
  { icon: '🂠', text: "The dealer's face-down card counts when it's flipped. Update your running count then." },
  { icon: '📈', text: "Positive count = more high cards remain = you have the edge. Bet more!" },
  { icon: '🎯', text: "Practice speed drills until each card's value is instant — no mental arithmetic needed." },
];

export default function HiLoGuide({ onBack }) {
  const [activeStep, setActiveStep] = useState(-1);

  const runningAtStep = (step) =>
    EXAMPLE.slice(0, step + 1).reduce((sum, c) => sum + c.value, 0);

  const currentTotal = activeStep >= 0 ? runningAtStep(activeStep) : 0;

  const handleCardTap = (i) => {
    if (i === activeStep) {
      setActiveStep(i - 1); // deactivate the last revealed card
    } else if (i === activeStep + 1) {
      setActiveStep(i); // reveal only the next card in sequence
    }
    // Ignore taps on cards before current position or more than one ahead
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 overflow-y-auto">
      <div className="px-4 pt-4 pb-2 flex items-center">
        <button onClick={onBack} className="text-gray-400 text-sm">&larr; Back</button>
        <h1 className="text-xl font-bold text-white flex-1 text-center pr-8">Hi-Lo Guide</h1>
      </div>

      <div className="px-4 pb-8 space-y-6">

        {/* Card Values */}
        <section>
          <h2 className="text-xs text-gray-500 uppercase tracking-wide mb-3">Card Values</h2>
          <div className="space-y-2">
            {CARD_GROUPS.map(group => (
              <div key={group.label} className={`flex items-center justify-between p-3 rounded-xl ${group.bg}`}>
                <div>
                  <div className={`font-bold text-sm ${group.color}`}>{group.ranks.join(', ')}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{group.label}</div>
                </div>
                <div className={`text-2xl font-bold w-10 text-right ${group.color}`}>{group.badge}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-xs text-gray-500 uppercase tracking-wide mb-3">How It Works</h2>
          <div className="bg-black/20 rounded-xl p-4 space-y-2 text-sm text-gray-300">
            <p>Start at <span className="text-white font-bold">0</span>. As each card is dealt, add its value to your running count.</p>
            <p className="text-emerald-400">High positive count → more 10s and Aces remain → <span className="font-bold">bet more</span>.</p>
            <p className="text-red-400">Negative count → more low cards remain → <span className="font-bold">bet the minimum</span>.</p>
          </div>
        </section>

        {/* Interactive Example */}
        <section>
          <h2 className="text-xs text-gray-500 uppercase tracking-wide mb-1">Interactive Example</h2>
          <p className="text-xs text-gray-500 mb-3">Tap each card to add it to your count:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {EXAMPLE.map((card, i) => {
              const isActive = i <= activeStep;
              const bgColor = isActive
                ? card.value > 0 ? 'bg-emerald-600' : card.value < 0 ? 'bg-red-600' : 'bg-slate-600'
                : 'bg-slate-700';
              return (
                <button
                  key={i}
                  onClick={() => handleCardTap(i)}
                  className={`px-3 py-2 rounded-lg font-bold text-sm transition-all active:scale-95 ${bgColor} text-white`}
                >
                  {card.rank}{card.suit}
                  {isActive && (
                    <span className="ml-1 text-xs opacity-80">
                      {card.value > 0 ? '+1' : card.value < 0 ? '-1' : '0'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeStep >= 0 ? (
            <div className={`text-center p-3 rounded-xl ${currentTotal > 0 ? 'bg-emerald-500/15' : currentTotal < 0 ? 'bg-red-500/15' : 'bg-gray-500/15'}`}>
              <div className="text-xs text-gray-400 mb-1">Running Count after {activeStep + 1} card{activeStep > 0 ? 's' : ''}</div>
              <div className={`text-3xl font-bold ${currentTotal > 0 ? 'text-emerald-400' : currentTotal < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                {currentTotal > 0 ? '+' : ''}{currentTotal}
              </div>
              {activeStep === EXAMPLE.length - 1 && (
                <button
                  onClick={() => setActiveStep(-1)}
                  className="mt-2 text-xs text-gray-500 underline"
                >
                  Reset
                </button>
              )}
            </div>
          ) : (
            <div className="text-center p-3 rounded-xl bg-gray-500/10">
              <div className="text-xs text-gray-500">Tap the first card to start</div>
            </div>
          )}
        </section>

        {/* True Count */}
        <section>
          <h2 className="text-xs text-gray-500 uppercase tracking-wide mb-3">True Count</h2>
          <div className="bg-black/20 rounded-xl p-4 space-y-2 text-sm text-gray-300">
            <p className="font-bold text-white">True Count = Running Count ÷ Decks Remaining</p>
            <p className="text-xs text-gray-500">In a 2-deck game with 1 deck left:</p>
            <div className="bg-black/20 rounded-lg p-2 text-center font-mono text-sm">
              <span className="text-white">RC = +4</span>
              <span className="text-gray-500"> → </span>
              <span className="text-emerald-400">TC = +4 ÷ 1 = <strong>+4</strong></span>
            </div>
            <div className="bg-black/20 rounded-lg p-2 text-center font-mono text-sm">
              <span className="text-white">RC = +4</span>
              <span className="text-gray-500"> → </span>
              <span className="text-yellow-400">TC = +4 ÷ 2 = <strong>+2</strong></span>
              <span className="text-gray-500 text-xs block">(2 decks left)</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">The true count normalizes for how many cards are left. Use it to size your bets.</p>
          </div>
        </section>

        {/* Bet Spread */}
        <section>
          <h2 className="text-xs text-gray-500 uppercase tracking-wide mb-3">Bet Spread (Hi-Lo)</h2>
          <div className="rounded-xl overflow-hidden border border-slate-700">
            {BET_SPREAD.map((row, i) => (
              <div
                key={row.tc}
                className={`flex justify-between px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-black/20' : 'bg-black/10'}`}
              >
                <span className={`font-bold ${row.color}`}>TC {row.tc}</span>
                <span className="text-gray-300">{row.bet}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Bet more when the count is in your favor</p>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-xs text-gray-500 uppercase tracking-wide mb-3">Pro Tips</h2>
          <div className="space-y-2">
            {TIPS.map((tip, i) => (
              <div key={i} className="flex gap-3 p-3 bg-black/20 rounded-xl">
                <span className="text-xl flex-shrink-0">{tip.icon}</span>
                <span className="text-sm text-gray-300">{tip.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Practice prompt */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
          <div className="text-emerald-400 font-bold mb-1">Ready to practice?</div>
          <div className="text-xs text-gray-400">Use Speed Drills to build counting speed, then test yourself in a full game.</div>
        </div>

      </div>
    </div>
  );
}
