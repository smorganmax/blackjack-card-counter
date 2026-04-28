import React, { useState, useEffect, useCallback, useRef } from 'react';
import ScreenTransition from './ScreenTransition';
import Card from './Card';
import { createShoe } from '../utils/deck';
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
  const [mode, setMode] = useState('menu');
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
  const timerRef = useRef(null);

  const startDrill = useCallback((drillMode) => {
    const shoe = createShoe();
    const cards = shoe.slice(0, cardCount);
    const count = cards.reduce((sum, c) => sum + hiLoValue(c), 0);
    setDrillCards(cards);
    setCorrectCount(count);
    setCurrentIndex(0);
    setGuess('');
    setStartTime(Date.now());
    setMode(drillMode === 'group' ? 'group' : 'single');
  }, [cardCount]);

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
    : '--';
  const accuracy = history.length > 0
    ? Math.round((history.filter(h => h.correct).length / history.length) * 100)
    : 0;

  if (mode === 'menu') {
    return (
      <ScreenTransition>
        <div className="flex flex-col h-full bg-gradient-to-b from-casino-black to-casino-slate overflow-y-auto hide-scrollbar">
          <div className="px-4 pt-4 pb-2 flex items-center">
            <button onClick={onBack} className="text-gray-400 text-sm font-medium active:text-white transition-colors">
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} className="inline mr-1"><path d="M15 18l-6-6 6-6" /></svg>
              Back
            </button>
            <h1 className="text-lg font-bold text-white flex-1 text-center pr-8">Speed Drills</h1>
          </div>

          <div className="px-5 py-4 space-y-5">
            <div className="section-card">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2 font-medium">Card Speed</label>
              <div className="flex gap-2">
                {SPEEDS.map(s => (
                  <button key={s.ms} onClick={() => setSpeed(s.ms)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
                      ${speed === s.ms ? 'bg-blue-600 text-white shadow-md' : 'bg-white/5 text-gray-400 active:bg-white/10'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="section-card">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2 font-medium">Number of Cards</label>
              <div className="flex gap-2">
                {CARD_COUNTS.map(n => (
                  <button key={n} onClick={() => setCardCount(n)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
                      ${cardCount === n ? 'bg-blue-600 text-white shadow-md' : 'bg-white/5 text-gray-400 active:bg-white/10'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => startDrill('single')}
              className="w-full py-4 bg-gradient-to-b from-emerald-500 to-emerald-600 text-white font-bold text-base rounded-2xl
                         active:scale-[0.96] shadow-lg border border-emerald-400/20 transition-all">
              Single Card Drill
            </button>

            <div className="section-card">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2 font-medium">Group Size</label>
              <div className="flex gap-2 mb-3">
                {[2, 3].map(n => (
                  <button key={n} onClick={() => setGroupSize(n)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200
                      ${groupSize === n ? 'bg-purple-600 text-white shadow-md' : 'bg-white/5 text-gray-400 active:bg-white/10'}`}>
                    {n} cards
                  </button>
                ))}
              </div>
              <button onClick={() => startDrill('group')}
                className="w-full py-4 bg-gradient-to-b from-purple-500 to-purple-600 text-white font-bold text-base rounded-2xl
                           active:scale-[0.96] shadow-lg border border-purple-400/20 transition-all">
                Group Counting Drill
              </button>
            </div>

            {history.length > 0 && (
              <div className="section-card">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-medium">Your Performance</div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-[10px] text-gray-500">Drills</div>
                    <div className="text-lg font-bold text-white tabular-nums">{history.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500">Accuracy</div>
                    <div className="text-lg font-bold text-emerald-400 tabular-nums">{accuracy}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500">Avg Off</div>
                    <div className="text-lg font-bold text-amber-400 tabular-nums">{avgDeviation}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScreenTransition>
    );
  }

  if (mode === 'single' || mode === 'group') {
    const cards = currentCards();
    const progress = Math.min((currentIndex / drillCards.length) * 100, 100);

    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-casino-black to-casino-slate items-center justify-center">
        <div className="text-xs text-gray-500 mb-3 font-medium">
          {currentIndex < drillCards.length ? `Card ${Math.min(currentIndex + 1, drillCards.length)} of ${drillCards.length}` : 'Done!'}
        </div>
        <div className="w-48 h-1.5 bg-white/5 rounded-full mb-10">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex gap-3 min-h-[120px] items-center">
          {cards.map((card, i) => (
            <div key={`${currentIndex}-${i}`}>
              <Card card={card} />
            </div>
          ))}
        </div>
        <div className="mt-10 text-xs text-gray-600 font-medium">Keep counting...</div>
      </div>
    );
  }

  if (mode === 'answer') {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-casino-black to-casino-slate items-center justify-center px-6">
        <div className="text-xl font-bold text-white mb-2">What's the Running Count?</div>
        <p className="text-sm text-gray-500 mb-8">{drillCards.length} cards at {SPEEDS.find(s => s.ms === speed)?.label}</p>

        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => setGuess(String((parseInt(guess || '0', 10)) - 1))}
            className="w-12 h-12 rounded-full glass text-white font-bold text-xl active:scale-95 active:bg-white/10">-</button>
          <input type="number" inputMode="numeric" value={guess} onChange={e => setGuess(e.target.value)}
            placeholder="0" className="w-24 h-14 text-center text-2xl font-bold bg-casino-surface text-white rounded-2xl
              border-2 border-white/10 focus:border-blue-500 focus:outline-none tabular-nums" />
          <button onClick={() => setGuess(String((parseInt(guess || '0', 10)) + 1))}
            className="w-12 h-12 rounded-full glass text-white font-bold text-xl active:scale-95 active:bg-white/10">+</button>
        </div>

        <button onClick={submitAnswer}
          className="w-full max-w-xs py-4 bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold text-lg rounded-2xl
                     active:scale-[0.96] shadow-lg border border-blue-400/20 transition-all">
          Submit
        </button>
      </div>
    );
  }

  if (mode === 'result') {
    const last = history[history.length - 1];
    const correct = last.guess === last.actual;

    return (
      <ScreenTransition>
        <div className="flex flex-col h-full bg-gradient-to-b from-casino-black to-casino-slate items-center justify-center px-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 animate-pop-in
            ${correct ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-2 border-red-500/30'}`}>
            {correct ? '✓' : '✗'}
          </div>
          <div className={`text-2xl font-bold mb-6 ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
            {correct ? 'Correct!' : 'Incorrect'}
          </div>

          <div className="section-card w-full max-w-xs space-y-2.5 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Your answer</span>
              <span className="text-white font-bold tabular-nums">{last.guess}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Correct count</span>
              <span className="text-emerald-400 font-bold tabular-nums">{last.actual}</span>
            </div>
            {!correct && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Off by</span>
                <span className="text-amber-400 font-bold tabular-nums">{last.deviation}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Time</span>
              <span className="text-white font-bold tabular-nums">{(last.timeMs / 1000).toFixed(1)}s</span>
            </div>
          </div>

          <button onClick={() => setMode('menu')}
            className="w-full max-w-xs py-4 bg-gradient-to-b from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-2xl
                       active:scale-[0.96] shadow-lg border border-emerald-400/20 transition-all mb-3">
            Try Again
          </button>
          <button onClick={onBack}
            className="w-full max-w-xs py-3 glass text-gray-300 font-medium rounded-2xl active:scale-[0.96] transition-all">
            Back to Menu
          </button>
        </div>
      </ScreenTransition>
    );
  }

  return null;
}
