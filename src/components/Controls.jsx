import React from 'react';

export default function Controls({ canHit, canStand, canDouble, canSplit, onHit, onStand, onDouble, onSplit }) {
  return (
    <div className="px-3 pb-4 pt-2">
      {/* Primary actions */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={onHit}
          disabled={!canHit}
          className="flex-1 py-4 rounded-xl font-bold text-base transition-all active:scale-95 shadow-md
                     bg-blue-600 hover:bg-blue-500 text-white
                     disabled:bg-gray-800 disabled:text-gray-600 disabled:shadow-none disabled:scale-100"
        >
          <div className="text-xl leading-none mb-0.5">👆</div>
          <div>Hit</div>
        </button>
        <button
          onClick={onStand}
          disabled={!canStand}
          className="flex-1 py-4 rounded-xl font-bold text-base transition-all active:scale-95 shadow-md
                     bg-red-600 hover:bg-red-500 text-white
                     disabled:bg-gray-800 disabled:text-gray-600 disabled:shadow-none disabled:scale-100"
        >
          <div className="text-xl leading-none mb-0.5">✋</div>
          <div>Stand</div>
        </button>
      </div>
      {/* Secondary actions */}
      <div className="flex gap-2">
        <button
          onClick={onDouble}
          disabled={!canDouble}
          className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95
                     bg-yellow-600 hover:bg-yellow-500 text-white
                     disabled:bg-gray-800 disabled:text-gray-600 disabled:scale-100"
        >
          Double
        </button>
        <button
          onClick={onSplit}
          disabled={!canSplit}
          className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95
                     bg-purple-600 hover:bg-purple-500 text-white
                     disabled:bg-gray-800 disabled:text-gray-600 disabled:scale-100"
        >
          Split
        </button>
      </div>
    </div>
  );
}
