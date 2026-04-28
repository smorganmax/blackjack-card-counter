import React from 'react';

export default function CountDisplay({ runningCount, trueCount }) {
  const rcColor = runningCount > 0 ? 'text-emerald-400' : runningCount < 0 ? 'text-red-400' : 'text-gray-300';
  const tcColor = trueCount > 0 ? 'text-emerald-400' : trueCount < 0 ? 'text-red-400' : 'text-gray-300';

  return (
    <div className="flex justify-center gap-4 py-1.5 px-4 animate-fade-in">
      <div className="glass rounded-xl px-4 py-1.5 flex items-center gap-3">
        <div className="text-center">
          <div className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">RC</div>
          <div className={`text-xl font-bold ${rcColor} tabular-nums animate-count-pulse`} key={runningCount}>
            {runningCount > 0 ? '+' : ''}{runningCount}
          </div>
        </div>
        <div className="w-px h-6 bg-white/10" />
        <div className="text-center">
          <div className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">TC</div>
          <div className={`text-xl font-bold ${tcColor} tabular-nums`}>
            {trueCount > 0 ? '+' : ''}{trueCount}
          </div>
        </div>
      </div>
    </div>
  );
}
