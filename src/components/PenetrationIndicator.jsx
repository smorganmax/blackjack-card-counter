import React, { useState } from 'react';
import { TOTAL_CARDS } from '../utils/deck';

const RELIABILITY_LEVELS = [
  { min: 0, max: 25, label: 'Low', color: 'text-gray-400', barColor: 'bg-gray-500' },
  { min: 25, max: 50, label: 'Medium', color: 'text-yellow-400', barColor: 'bg-yellow-400' },
  { min: 50, max: 75, label: 'High', color: 'text-emerald-400', barColor: 'bg-emerald-400' },
  { min: 75, max: 100, label: 'Max', color: 'text-green-300', barColor: 'bg-green-300' },
];

function playerEdge(tc) {
  return (-0.4 + tc * 0.5).toFixed(1);
}

export default function PenetrationIndicator({ shoeSize, trueCount, showPenetration, showReliability, compact = false }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!showPenetration && !showReliability) return null;

  const dealtPercent = Math.round(((TOTAL_CARDS - shoeSize) / TOTAL_CARDS) * 100);
  const level = RELIABILITY_LEVELS.find(l => dealtPercent >= l.min && dealtPercent < l.max) || RELIABILITY_LEVELS[3];
  const edge = playerEdge(trueCount);
  const edgeNum = parseFloat(edge);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {showPenetration && (
          <div className="flex items-center gap-1.5">
            <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full ${level.barColor} rounded-full transition-all duration-300`}
                style={{ width: `${dealtPercent}%` }} />
            </div>
            <span className={`text-[10px] font-bold ${level.color} tabular-nums`}>{dealtPercent}%</span>
          </div>
        )}
        {showPenetration && (
          <span className={`text-[10px] font-bold ${edgeNum >= 0 ? 'text-emerald-400' : 'text-red-400'} tabular-nums`}>
            {edgeNum >= 0 ? '+' : ''}{edge}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="mx-3 mb-1">
      {showPenetration && (
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1">
            <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
              <div className={`h-full ${level.barColor} rounded-full transition-all duration-300`}
                style={{ width: `${dealtPercent}%` }} />
            </div>
          </div>
          <div className={`text-xs font-bold ${level.color} whitespace-nowrap tabular-nums`}>{dealtPercent}%</div>
        </div>
      )}

      <div className="flex justify-between items-center">
        {showReliability && (
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className={`text-[10px] font-medium ${level.color} glass px-2 py-0.5 rounded-full`}
          >
            {level.label} reliability
          </button>
        )}
        {showPenetration && (
          <div className={`text-[10px] font-bold ${edgeNum >= 0 ? 'text-emerald-400' : 'text-red-400'} tabular-nums`}>
            Edge: {edgeNum >= 0 ? '+' : ''}{edge}%
          </div>
        )}
      </div>

      {showTooltip && (
        <div className="mt-1 p-2.5 glass-dark rounded-xl text-[11px] text-gray-300 animate-fade-in">
          Card counts become more reliable as more cards are dealt. The true count indicates your edge.
          <button onClick={() => setShowTooltip(false)} className="ml-2 text-blue-400 font-medium">OK</button>
        </div>
      )}
    </div>
  );
}
