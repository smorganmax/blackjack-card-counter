import React from 'react';

export default function CountDisplay({ runningCount, trueCount }) {
  const rcColor = runningCount > 0 ? 'text-emerald-400' : runningCount < 0 ? 'text-red-400' : 'text-gray-300';
  const tcColor = trueCount > 0 ? 'text-emerald-400' : trueCount < 0 ? 'text-red-400' : 'text-gray-300';

  return (
    <div className="flex justify-center gap-6 py-1 px-4">
      <div className="text-center">
        <div className="text-[10px] text-gray-500 uppercase">Running</div>
        <div className={`text-lg font-bold ${rcColor}`}>
          {runningCount > 0 ? '+' : ''}{runningCount}
        </div>
      </div>
      <div className="text-center">
        <div className="text-[10px] text-gray-500 uppercase">True</div>
        <div className={`text-lg font-bold ${tcColor}`}>
          {trueCount > 0 ? '+' : ''}{trueCount}
        </div>
      </div>
    </div>
  );
}
