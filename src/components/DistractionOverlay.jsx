import React, { useState, useEffect, useCallback, useRef } from 'react';

const MATH_PROBLEMS = [
  { q: '7 x 8', a: 56 }, { q: '9 x 6', a: 54 }, { q: '12 x 7', a: 84 },
  { q: '8 x 9', a: 72 }, { q: '6 x 7', a: 42 }, { q: '11 x 8', a: 88 },
  { q: '13 x 4', a: 52 }, { q: '15 x 3', a: 45 }, { q: '9 x 9', a: 81 },
  { q: '7 x 7', a: 49 }, { q: '8 x 6', a: 48 }, { q: '12 x 5', a: 60 },
  { q: '14 x 3', a: 42 }, { q: '6 x 9', a: 54 }, { q: '8 x 8', a: 64 },
  { q: '11 x 6', a: 66 }, { q: '9 x 7', a: 63 }, { q: '13 x 5', a: 65 },
];

const PIT_BOSS_MESSAGES = [
  'Pit boss is watching...',
  'Floor supervisor approaching...',
  'Eye in the sky alert...',
  'Pit boss checking ratings...',
];

export default function DistractionOverlay({ enabled }) {
  const [mathProblem, setMathProblem] = useState(null);
  const [mathAnswer, setMathAnswer] = useState('');
  const [flash, setFlash] = useState(null);
  const [pitBoss, setPitBoss] = useState(null);
  const [bgShift, setBgShift] = useState(false);
  const intervalRef = useRef(null);

  const triggerDistraction = useCallback(() => {
    const type = Math.random();
    if (type < 0.3) {
      const problem = MATH_PROBLEMS[Math.floor(Math.random() * MATH_PROBLEMS.length)];
      setMathProblem(problem);
      setMathAnswer('');
    } else if (type < 0.5) {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
    } else if (type < 0.7) {
      const msg = PIT_BOSS_MESSAGES[Math.floor(Math.random() * PIT_BOSS_MESSAGES.length)];
      setPitBoss(msg);
      setTimeout(() => setPitBoss(null), 3000);
    } else {
      setBgShift(true);
      setTimeout(() => setBgShift(false), 2000);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      if (Math.random() < 0.4) triggerDistraction();
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [enabled, triggerDistraction]);

  const submitMath = () => {
    setMathProblem(null);
    setMathAnswer('');
  };

  if (!enabled) return null;

  return (
    <>
      {bgShift && (
        <div className="fixed inset-0 pointer-events-none z-10 bg-purple-900/10 transition-opacity duration-500" />
      )}
      {flash && (
        <div className="fixed inset-0 pointer-events-none z-20 bg-white/10" />
      )}
      {pitBoss && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-30 animate-slide-down">
          <div className="glass-dark text-amber-300 text-sm font-semibold px-5 py-2.5 rounded-2xl whitespace-nowrap flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {pitBoss}
          </div>
        </div>
      )}
      {mathProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in">
          <div className="bg-casino-surface rounded-3xl p-6 mx-4 max-w-xs w-full border border-white/10 animate-pop-in">
            <div className="text-xs text-gray-500 mb-1 text-center uppercase tracking-widest">Quick Math!</div>
            <div className="text-3xl font-bold text-white text-center mb-5">{mathProblem.q} = ?</div>
            <input
              type="number"
              inputMode="numeric"
              value={mathAnswer}
              onChange={e => setMathAnswer(e.target.value)}
              autoFocus
              className="w-full h-12 text-center text-xl font-bold bg-white/5 text-white rounded-2xl
                border-2 border-white/10 focus:border-amber-500 focus:outline-none mb-4 tabular-nums"
            />
            <button onClick={submitMath}
              className="w-full py-3.5 bg-gradient-to-b from-amber-500 to-amber-600 text-white font-bold rounded-2xl
                active:scale-[0.96] shadow-lg border border-amber-400/20">
              Answer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
