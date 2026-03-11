import React from 'react';

export default function CountDisplay({ runningCount, trueCount }) {
  const rcColor = runningCount > 0 ? 'text-emerald-400' : runningCount < 0 ? 'text-red-400' : 'text-gray-300';
  const tcColor = trueCount > 0 ? 'text-emerald-400' : trueCount < 0 ? 'text-red-400' : 'text-gray-300';
  const glowColor = runningCount > 2 ? 'shadow-emerald-500/30' : runningCount < -2 ? 'shadow-red-500/30' : '';

  return (
    <div className={`mx-3 mb-1 flex gap-2`}>
      <div className={`flex-1 flex flex-col items-center py-2 rounded-xl bg-black/30 shadow-md ${glowColor}`}>
        <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">Running</div>
        <div className={`text-2xl font-extrabold tabular-nums ${rcColor}`}
          style={runningCount > 2 ? { textShadow: '0 0 12px rgba(52,211,153,0.7)' } : runningCount < -2 ? { textShadow: '0 0 12px rgba(248,113,113,0.7)' } : {}}>
          {runningCount > 0 ? '+' : ''}{runningCount}
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center py-2 rounded-xl bg-black/30 shadow-md">
        <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">True</div>
        <div className={`text-2xl font-extrabold tabular-nums ${tcColor}`}>
          {trueCount > 0 ? '+' : ''}{trueCount}
        </div>
      </div>
    </div>
  );
}
