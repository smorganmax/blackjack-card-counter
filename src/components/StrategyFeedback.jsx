import React, { useEffect, useState } from 'react';
import { actionLabel } from '../utils/strategy';

export default function StrategyFeedback({ feedback, deviationFeedback }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (feedback) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  if (!visible || !feedback) return null;

  return (
    <div className="flex justify-center py-1 px-4">
      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold slide-up ${
        feedback.correct
          ? 'bg-emerald-500/20 text-emerald-400'
          : 'bg-red-500/20 text-red-400'
      }`}>
        <span className="text-lg">{feedback.correct ? '✓' : '✗'}</span>
        <span>
          {feedback.correct
            ? 'Correct play!'
            : `Correct: ${actionLabel(feedback.recommended)}`}
        </span>
        {deviationFeedback?.isDeviation && (
          <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full ml-1">
            I18: {deviationFeedback.deviationLabel}
          </span>
        )}
      </div>
    </div>
  );
}
