import React from 'react';
import { suitColor } from '../utils/deck';

export default function Card({ card, hidden = false, small = false }) {
  const w = small ? 'w-10 h-14' : 'w-14 h-20';
  const textSize = small ? 'text-xs' : 'text-sm';

  if (hidden) {
    return (
      <div className={`${w} rounded-lg bg-blue-800 border-2 border-blue-600 flex items-center justify-center card-deal shadow-lg`}>
        <div className="text-blue-400 text-lg font-bold">?</div>
      </div>
    );
  }

  const color = suitColor(card.suit) === 'red' ? 'text-red-600' : 'text-gray-900';

  return (
    <div className={`${w} rounded-lg bg-white border border-gray-300 flex flex-col items-center justify-between p-1 card-deal shadow-lg`}>
      <div className={`${textSize} font-bold ${color} self-start leading-none`}>
        {card.rank}
      </div>
      <div className={`${small ? 'text-base' : 'text-xl'} ${color}`}>
        {card.suit}
      </div>
      <div className={`${textSize} font-bold ${color} self-end leading-none rotate-180`}>
        {card.rank}
      </div>
    </div>
  );
}
