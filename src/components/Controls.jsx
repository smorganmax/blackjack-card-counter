import React from 'react';

function ActionIcon({ type }) {
  const props = { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round' };

  switch (type) {
    case 'hit':
      return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
    case 'stand':
      return <svg {...props}><path d="M5 12h14" /></svg>;
    case 'double':
      return <svg {...props}><path d="M12 5v14M5 8h14M5 16h14" /></svg>;
    case 'split':
      return <svg {...props}><path d="M8 5v14M16 5v14M5 12h14" /></svg>;
    default:
      return null;
  }
}

const buttons = [
  { key: 'hit', label: 'Hit', gradient: 'from-blue-500 to-blue-600', border: 'border-blue-400/20', disabledBg: 'bg-gray-800' },
  { key: 'stand', label: 'Stand', gradient: 'from-red-500 to-red-600', border: 'border-red-400/20', disabledBg: 'bg-gray-800' },
  { key: 'double', label: 'Double', gradient: 'from-amber-500 to-amber-600', border: 'border-amber-400/20', disabledBg: 'bg-gray-800' },
  { key: 'split', label: 'Split', gradient: 'from-purple-500 to-purple-600', border: 'border-purple-400/20', disabledBg: 'bg-gray-800' },
];

export default function Controls({ canHit, canStand, canDouble, canSplit, onHit, onStand, onDouble, onSplit }) {
  const enabled = { hit: canHit, stand: canStand, double: canDouble, split: canSplit };
  const handlers = { hit: onHit, stand: onStand, double: onDouble, split: onSplit };

  return (
    <div className="flex justify-center gap-2.5 px-4 pb-5 pt-2">
      {buttons.map(btn => {
        const isEnabled = enabled[btn.key];
        return (
          <button
            key={btn.key}
            onClick={handlers[btn.key]}
            disabled={!isEnabled}
            className={`flex-1 max-w-[88px] py-3.5 rounded-2xl font-bold text-sm transition-all duration-150
              ${isEnabled
                ? `bg-gradient-to-b ${btn.gradient} text-white border ${btn.border} shadow-lg active:scale-[0.94] active:shadow-md`
                : 'bg-gray-800/50 text-gray-600 border border-gray-700/30'
              }`}
          >
            <div className="flex flex-col items-center gap-0.5">
              <ActionIcon type={btn.key} />
              <span>{btn.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
