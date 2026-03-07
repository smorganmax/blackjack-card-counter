import React, { useState } from 'react';
import { TOTAL_CARDS } from '../utils/deck';

const RELIABILITY_LEVELS = [
  { min: 0, max: 25, label: 'Low reliability', sublabel: 'early shoe', color: 'text-gray-400', bg: 'bg-gray-600', barColor: 'bg-gray-400' },
  { min: 25, max: 50, label: 'Medium reliability', sublabel: '', color: 'text-yellow-400', bg: 'bg-yellow-900/30', barColor: 'bg-yellow-400' },
  { min: 50, max: 75, label: 'High reliability', sublabel: 'count is meaningful', color: 'text-emerald-400', bg: 'bg-emerald-900/30', barColor: 'bg-emerald-400' },
  { min: 75, max: 100, label: 'Maximum reliability', sublabel: '', color: 'text-green-300', bg: 'bg-green-900/30', barColor: 'bg-green-300' },
];

// Approximate player edge based on true count (Hi-Lo, 2 deck)
// Baseline house edge ~0.4%, each TC point ≈ +0.5%
function playerEdge(tc) {
  return (-0.4 + tc * 0.5).toFixed(1);
}

export default function PenetrationIndicator({ shoeSize, trueCount, showPenetration, showReliability }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!showPenetration && !showReliability) return null;

  const dealtPercent = Math.round(((TOTAL_CARDS - shoeSize) / TOTAL_CARDS) * 100);
  const level = RELIABILITY_LEVELS.find(l => dealtPercent >= l.min && dealtPercent < l.max) || RELIABILITY_LEVELS[3];
  const edge = playerEdge(trueCount);
  const edgeNum = parseFloat(edge);

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
          <div className={`text-xs font-bold ${level.color} whitespace-nowrap`}>{dealtPercent}%</div>
        </div>
      )}

      <div className="flex justify-between items-center">
        {showReliability && (
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className={`text-[10px] font-medium ${level.color} ${level.bg} px-2 py-0.5 rounded-full`}
          >
            {level.label}
            {level.sublabel ? ` — ${level.sublabel}` : ''}
          </button>
        )}

        {showPenetration && (
          <div className={`text-[10px] font-bold ${edgeNum >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            Edge: {edgeNum >= 0 ? '+' : ''}{edge}%
          </div>
        )}
      </div>

      {showTooltip && (
        <div className="mt-1 p-2 bg-black/40 rounded-lg text-[10px] text-gray-300">
          Card counts become more reliable as more cards are dealt. The true count indicates your edge.
          <button onClick={() => setShowTooltip(false)} className="ml-2 text-blue-400">dismiss</button>
        </div>
      )}
    </div>
  );
}
