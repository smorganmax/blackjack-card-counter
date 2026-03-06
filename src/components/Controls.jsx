import React from 'react';

export default function Controls({ canHit, canStand, canDouble, canSplit, onHit, onStand, onDouble, onSplit }) {
  return (
    <div className="flex justify-center gap-2 px-4 pb-4 pt-2">
      <button
        onClick={onHit}
        disabled={!canHit}
        className="flex-1 max-w-[90px] py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl
                   active:scale-95 transition-all disabled:bg-gray-700 disabled:text-gray-500 text-sm"
      >
        Hit
      </button>
      <button
        onClick={onStand}
        disabled={!canStand}
        className="flex-1 max-w-[90px] py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl
                   active:scale-95 transition-all disabled:bg-gray-700 disabled:text-gray-500 text-sm"
      >
        Stand
      </button>
      <button
        onClick={onDouble}
        disabled={!canDouble}
        className="flex-1 max-w-[90px] py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-xl
                   active:scale-95 transition-all disabled:bg-gray-700 disabled:text-gray-500 text-sm"
      >
        Double
      </button>
      <button
        onClick={onSplit}
        disabled={!canSplit}
        className="flex-1 max-w-[90px] py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl
                   active:scale-95 transition-all disabled:bg-gray-700 disabled:text-gray-500 text-sm"
      >
        Split
      </button>
    </div>
  );
}
