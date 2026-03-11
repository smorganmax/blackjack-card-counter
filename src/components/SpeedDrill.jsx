import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from './Card';
import { createShoe, shuffle } from '../utils/deck';
import { hiLoValue } from '../utils/counting';
import { loadDrillHistory, saveDrillHistory } from '../utils/storage';

const SPEEDS = [
  { label: '1s', ms: 1000 },
  { label: '0.75s', ms: 750 },
  { label: '0.5s', ms: 500 },
  { label: '0.25s', ms: 250 },
];

const CARD_COUNTS = [10, 20, 30, 52];

export default function SpeedDrill({ onBack }) {
  const [mode, setMode] = useState('menu'); // menu, single, group, running, answer, result
  const [speed, setSpeed] = useState(1000);
  const [cardCount, setCardCount] = useState(10);
  const [drillCards, setDrillCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [groupSize, setGroupSize] = useState(2);
  const [guess, setGuess] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [history, setHistory] = useState(() => loadDrillHistory());
  const [showBreakdown, setShowBreakdown] = useState(false);
  const timerRef = useRef(null);

  const startDrill = useCallback((drillMode) => {
    const shoe = createShoe();
    const cards = shoe.slice(0, cardCount);
    const count = cards.reduce((sum, c) => sum + hiLoValue(c), 0);
    setDrillCards(cards);
    setCorrectCount(count);
    setCurrentIndex(0);
    setGuess('');
    setShowBreakdown(false);
    setStartTime(Date.now());
    setMode(drillMode === 'group' ? 'group' : 'single');
  }, [cardCount]);

  // Auto-advance cards
  useEffect(() => {
    if (mode !== 'single' && mode !== 'group') return;

    const gs = mode === 'group' ? groupSize : 1;
    if (currentIndex >= drillCards.length) {
      setElapsed(Date.now() - startTime);
      setMode('answer');
      return;
    }

    timerRef.current = setTimeout(() => {
      setCurrentIndex(prev => prev + gs);
    }, speed);

    return () => clearTimeout(timerRef.current);
  }, [mode, currentIndex, drillCards.length, speed, groupSize, startTime]);

  const submitAnswer = () => {
    if (guess === '' || guess === '-') return;
    const g = parseInt(guess, 10);
    const entry = {
      date: Date.now(),
      cardCount,
      speed,
      mode: mode === 'group' ? 'group' : 'single',
      correct: g === correctCount,
      guess: g,
      actual: correctCount,
      deviation: Math.abs(g - correctCount),
      timeMs: elapsed,
    };
    const newHistory = [...history, entry];
    setHistory(newHistory);
    saveDrillHistory(newHistory);
    setMode('result');
  };

  const currentCards = () => {
    if (mode === 'single') {
      return currentIndex < drillCards.length ? [drillCards[currentIndex]] : [];
    }
    return drillCards.slice(currentIndex, currentIndex + groupSize);
  };

  const avgDeviation = history.length > 0
    ? (history.reduce((s, h) => s + h.deviation, 0) / history.length).toFixed(1)
    : '—';
  const accuracy = history.length > 0
    ? Math.round((history.filter(h => h.correct).length / history.length) * 100)
    : 0;

  if (mode === 'menu') {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 overflow-y-auto">
        <div className="px-4 pt-4 pb-2 flex items-center">
          <button onClick={onBack} className="text-gray-400 text-sm">&larr; Back</button>
          <h1 className="text-xl font-bold text-white flex-1 text-center pr-8">Speed Drills</h1>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Speed selection */}
          <div>
            <label className="text-gray-400 text-sm block mb-2">Card Speed</label>
            <div className="flex gap-2">
              {SPEEDS.map(s => (
                <button key={s.ms} onClick={() => setSpeed(s.ms)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm ${speed === s.ms ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card count */}
          <div>
            <label className="text-gray-400 text-sm block mb-2">Number of Cards</label>
            <div className="flex gap-2">
              {CARD_COUNTS.map(n => (
                <button key={n} onClick={() => setCardCount(n)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm ${cardCount === n ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Start buttons */}
          <button onClick={() => startDrill('single')}
            className="w-full py-4 bg-emerald-500 text-white font-bold text-lg rounded-xl active:scale-95">
            Single Card Drill
          </button>

          <div>
            <label className="text-gray-400 text-sm block mb-2">Group Size</label>
            <div className="flex gap-2 mb-3">
              {[2, 3].map(n => (
                <button key={n} onClick={() => setGroupSize(n)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm ${groupSize === n ? 'bg-purple-600 text-white' : 'bg-slate-700 text-gray-300'}`}>
                  {n} cards
                </button>
              ))}
            </div>
            <button onClick={() => startDrill('group')}
              className="w-full py-4 bg-purple-500 text-white font-bold text-lg rounded-xl active:scale-95">
              Group Counting Drill
            </button>
          </div>

          {/* Past performance */}
          {history.length > 0 && (
            <div className="p-4 bg-black/20 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">Your Performance</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs text-gray-500">Drills</div>
                  <div className="text-lg font-bold text-white">{history.length}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                  <div className="text-lg font-bold text-emerald-400">{accuracy}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Avg Off</div>
                  <div className="text-lg font-bold text-yellow-400">{avgDeviation}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'single' || mode === 'group') {
    const cards = currentCards();
    const progress = Math.min((currentIndex / drillCards.length) * 100, 100);

    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 items-center justify-center">
        <div className="text-sm text-gray-400 mb-2">
          {currentIndex < drillCards.length ? `Card ${Math.min(currentIndex + 1, drillCards.length)} of ${drillCards.length}` : 'Done!'}
        </div>
        <div className="w-48 h-1.5 bg-black/30 rounded-full mb-8">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex gap-3 min-h-[120px] items-center">
          {cards.map((card, i) => (
            <div key={`${currentIndex}-${i}`} className="card-deal">
              <Card card={card} />
            </div>
          ))}
        </div>
        <div className="mt-8 text-xs text-gray-500">Keep counting...</div>
      </div>
    );
  }

  if (mode === 'answer') {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 items-center justify-center px-6">
        <div className="text-xl font-bold text-white mb-2">What's the Running Count?</div>
        <p className="text-sm text-gray-400 mb-6">{drillCards.length} cards shown at {SPEEDS.find(s => s.ms === speed)?.label}</p>

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setGuess(String((parseInt(guess || '0', 10)) - 1))}
            className="w-12 h-12 rounded-full bg-slate-700 text-white font-bold text-xl active:scale-95">-</button>
          <input type="number" inputMode="numeric" value={guess} onChange={e => setGuess(e.target.value)}
            placeholder="0" className="w-24 h-14 text-center text-2xl font-bold bg-slate-800 text-white rounded-xl border-2 border-slate-600 focus:border-blue-500 focus:outline-none" />
          <button onClick={() => setGuess(String((parseInt(guess || '0', 10)) + 1))}
            className="w-12 h-12 rounded-full bg-slate-700 text-white font-bold text-xl active:scale-95">+</button>
        </div>

        <button onClick={submitAnswer}
          className="w-full max-w-xs py-4 bg-blue-600 text-white font-bold text-lg rounded-xl active:scale-95 mb-3">
          Submit
        </button>
      </div>
    );
  }

  if (mode === 'result') {
    const last = history[history.length - 1];
    const correct = last.guess === last.actual;

    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 items-center justify-center px-6 overflow-y-auto">
        <div className={`text-5xl mb-4 ${correct ? '' : ''}`}>{correct ? '✓' : '✗'}</div>
        <div className={`text-2xl font-bold mb-2 ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
          {correct ? 'Correct!' : 'Incorrect'}
        </div>

        <div className="bg-black/20 rounded-xl p-4 w-full max-w-xs mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Your answer:</span>
            <span className="text-white font-bold">{last.guess > 0 ? '+' : ''}{last.guess}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Correct count:</span>
            <span className="text-emerald-400 font-bold">{last.actual > 0 ? '+' : ''}{last.actual}</span>
          </div>
          {!correct && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Off by:</span>
              <span className="text-yellow-400 font-bold">{last.deviation}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Time:</span>
            <span className="text-white font-bold">{(last.timeMs / 1000).toFixed(1)}s</span>
          </div>
        </div>

        {/* Card breakdown */}
        <div className="w-full max-w-xs mb-4">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full text-xs text-blue-400 py-2 text-center active:opacity-70"
          >
            {showBreakdown ? '▲ Hide cards' : `▼ Review all ${drillCards.length} cards`}
          </button>
          {showBreakdown && (
            <div className="bg-black/20 rounded-xl p-3">
              <div className="flex flex-wrap gap-1 justify-center">
                {drillCards.map((card, i) => {
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
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>
                  <span className="text-emerald-400">2–6=+1</span>
                  {' '}<span className="text-gray-400">7–9=0</span>
                  {' '}<span className="text-red-400">10–A=-1</span>
                </span>
                <span>Total: <span className={last.actual >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {last.actual > 0 ? '+' : ''}{last.actual}
                </span></span>
              </div>
            </div>
          )}
        </div>

        <button onClick={() => setMode('menu')}
          className="w-full max-w-xs py-4 bg-emerald-500 text-white font-bold text-lg rounded-xl active:scale-95 mb-3">
          Try Again
        </button>
        <button onClick={onBack}
          className="w-full max-w-xs py-3 bg-slate-700 text-gray-300 font-medium rounded-xl active:scale-95">
          Back to Menu
        </button>
      </div>
    );
  }

  return null;
}
