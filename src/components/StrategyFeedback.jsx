import React, { useEffect, useState } from 'react';
import { actionLabel } from '../utils/strategy';
import { getExplanation, getDeviationExplanation } from '../utils/strategyExplanations';

export default function StrategyFeedback({ feedback, deviationFeedback }) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (feedback) {
      setVisible(true);
      setExpanded(false);
    }
  }, [feedback]);

  if (!visible || !feedback) return null;

  const explanation = feedback.playerCards && feedback.dealerUpcard
    ? getExplanation(feedback.playerCards, feedback.dealerUpcard, feedback.handType)
    : null;

  const devExplanation = deviationFeedback?.isDeviation && deviationFeedback?.deviationId
    ? getDeviationExplanation(deviationFeedback.deviationId)
    : null;

  const displayExplanation = devExplanation || explanation;

  return (
    <div className="flex justify-center py-1.5 px-4 animate-pop-in">
      <div className={`rounded-2xl text-sm font-semibold overflow-hidden transition-all duration-200 ${
        feedback.correct
          ? 'bg-emerald-500/15 border border-emerald-500/20'
          : 'bg-red-500/15 border border-red-500/20'
      }`}>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            feedback.correct ? 'bg-emerald-500/30 text-emerald-400' : 'bg-red-500/30 text-red-400'
          }`}>
            {feedback.correct ? '✓' : '✗'}
          </div>
          <span className={feedback.correct ? 'text-emerald-400' : 'text-red-400'}>
            {feedback.correct
              ? 'Correct play!'
              : `Should ${actionLabel(feedback.recommended)}`}
          </span>
          {deviationFeedback?.isDeviation && (
            <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full">
              I18
            </span>
          )}
          {displayExplanation && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-auto text-gray-500 text-xs active:text-gray-300"
            >
              {expanded ? 'less' : 'why?'}
            </button>
          )}
        </div>
        {expanded && displayExplanation && (
          <div className="px-4 pb-2.5 text-xs text-gray-400 leading-relaxed animate-fade-in border-t border-white/5 pt-2">
            {displayExplanation}
          </div>
        )}
      </div>
    </div>
  );
}
