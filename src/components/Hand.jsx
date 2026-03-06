import React from 'react';
import Card from './Card';
import { handTotal } from '../utils/hand';

export default function Hand({ cards, hidden = false, label, active = false, small = false }) {
  const total = hidden ? handTotal([cards[0]]) : handTotal(cards);
  const displayTotal = hidden ? `${total} + ?` : total;

  return (
    <div className={`flex flex-col items-center gap-1 ${active ? 'scale-105' : ''} transition-transform`}>
      {label && (
        <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
      )}
      <div className="flex gap-1" style={{ marginLeft: cards.length > 4 ? '-4px' : '0' }}>
        {cards.map((card, i) => (
          <div
            key={i}
            style={cards.length > 4 ? { marginLeft: i > 0 ? '-12px' : '0', zIndex: i } : {}}
          >
            <Card card={card} hidden={hidden && i === 1} small={small} />
          </div>
        ))}
      </div>
      <div className={`text-sm font-bold ${active ? 'text-yellow-400' : 'text-white'}`}>
        {displayTotal}
      </div>
    </div>
  );
}
