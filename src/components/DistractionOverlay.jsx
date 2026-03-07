import React, { useState, useEffect, useCallback, useRef } from 'react';

const MATH_PROBLEMS = [
  { q: '7 × 8', a: 56 }, { q: '9 × 6', a: 54 }, { q: '12 × 7', a: 84 },
  { q: '8 × 9', a: 72 }, { q: '6 × 7', a: 42 }, { q: '11 × 8', a: 88 },
  { q: '13 × 4', a: 52 }, { q: '15 × 3', a: 45 }, { q: '9 × 9', a: 81 },
  { q: '7 × 7', a: 49 }, { q: '8 × 6', a: 48 }, { q: '12 × 5', a: 60 },
  { q: '14 × 3', a: 42 }, { q: '6 × 9', a: 54 }, { q: '8 × 8', a: 64 },
  { q: '11 × 6', a: 66 }, { q: '9 × 7', a: 63 }, { q: '13 × 5', a: 65 },
];

const PIT_BOSS_MESSAGES = [
  '👀 Pit boss is watching...',
  '🕵️ Floor supervisor approaching...',
  '👁️ Eye in the sky alert...',
  '📋 Pit boss checking ratings...',
];

export default function DistractionOverlay({ enabled, onDistraction }) {
  const [mathProblem, setMathProblem] = useState(null);
  const [mathAnswer, setMathAnswer] = useState('');
  const [flash, setFlash] = useState(null);
  const [pitBoss, setPitBoss] = useState(null);
  const [bgShift, setBgShift] = useState(false);
  const intervalRef = useRef(null);

  const triggerDistraction = useCallback(() => {
    const type = Math.random();

    if (type < 0.3) {
      // Math question
      const problem = MATH_PROBLEMS[Math.floor(Math.random() * MATH_PROBLEMS.length)];
      setMathProblem(problem);
      setMathAnswer('');
    } else if (type < 0.5) {
      // Visual flash
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
    } else if (type < 0.7) {
      // Pit boss
      const msg = PIT_BOSS_MESSAGES[Math.floor(Math.random() * PIT_BOSS_MESSAGES.length)];
      setPitBoss(msg);
      setTimeout(() => setPitBoss(null), 3000);
    } else {
      // Background shift
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
      if (Math.random() < 0.4) {
        triggerDistraction();
      }
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [enabled, triggerDistraction]);

  const submitMath = () => {
    const correct = parseInt(mathAnswer, 10) === mathProblem.a;
    setMathProblem(null);
    setMathAnswer('');
  };

  if (!enabled) return null;

  return (
    <>
      {/* Background color shift */}
      {bgShift && (
        <div className="fixed inset-0 pointer-events-none z-10 bg-purple-900/10 transition-opacity duration-500" />
      )}

      {/* Visual flash */}
      {flash && (
        <div className="fixed inset-0 pointer-events-none z-20 bg-white/15 animate-pulse" />
      )}

      {/* Pit boss indicator */}
      {pitBoss && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-30 bg-red-900/90 text-yellow-300 text-sm font-bold px-4 py-2 rounded-full animate-pulse whitespace-nowrap">
          {pitBoss}
        </div>
      )}

      {/* Math question modal */}
      {mathProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-800 rounded-2xl p-6 mx-4 max-w-xs w-full slide-up">
            <div className="text-sm text-gray-400 mb-1 text-center">Quick Math!</div>
            <div className="text-3xl font-bold text-white text-center mb-4">{mathProblem.q} = ?</div>
            <input
              type="number"
              inputMode="numeric"
              value={mathAnswer}
              onChange={e => setMathAnswer(e.target.value)}
              autoFocus
              className="w-full h-12 text-center text-xl font-bold bg-slate-700 text-white rounded-xl border-2 border-slate-600 focus:border-yellow-500 focus:outline-none mb-3"
            />
            <button onClick={submitMath}
              className="w-full py-3 bg-yellow-600 text-white font-bold rounded-xl active:scale-95">
              Answer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
