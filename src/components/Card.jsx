import React from 'react';
import { suitColor } from '../utils/deck';

export default function Card({ card, hidden = false, small = false }) {
  const w = small ? 'w-10 h-14' : 'w-14 h-20';
  const rankSize = small ? 'text-xs' : 'text-sm';
  const suitSize = small ? 'text-base' : 'text-xl';

  if (hidden) {
    return (
      <div className={`${w} rounded-lg card-deal shadow-md overflow-hidden`}
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', border: '2px solid #3b82f6' }}>
        {/* Card back pattern */}
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="absolute inset-1 rounded border border-blue-400/40"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(59,130,246,0.15) 3px, rgba(59,130,246,0.15) 4px)',
            }}
          />
          <div className="relative z-10 w-5 h-5 rotate-45 border-2 border-blue-300/60 bg-blue-500/20" />
        </div>
      </div>
    );
  }

  const isRed = suitColor(card.suit) === 'red';
  const color = isRed ? 'text-red-600' : 'text-gray-900';

  return (
    <div className={`${w} rounded-lg bg-white flex flex-col justify-between p-1 card-deal shadow-md`}
      style={{ border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8)' }}>
      {/* Top-left rank + suit */}
      <div className={`flex flex-col items-start leading-none ${color}`}>
        <span className={`${rankSize} font-extrabold leading-none`}>{card.rank}</span>
        <span className="text-[10px] leading-none">{card.suit}</span>
      </div>
      {/* Center suit */}
      <div className={`flex items-center justify-center ${suitSize} ${color}`}>
        {card.suit}
      </div>
      {/* Bottom-right rank + suit (rotated) */}
      <div className={`flex flex-col items-end leading-none rotate-180 ${color}`}>
        <span className={`${rankSize} font-extrabold leading-none`}>{card.rank}</span>
        <span className="text-[10px] leading-none">{card.suit}</span>
      </div>
    </div>
  );
}
