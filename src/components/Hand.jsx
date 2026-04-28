import React from 'react';
import Card from './Card';
import { handTotal } from '../utils/hand';

export default function Hand({ cards, hidden = false, label, active = false, small = false }) {
  const total = hidden ? handTotal([cards[0]]) : handTotal(cards);
  const displayTotal = hidden ? `${total}+?` : total;

  const overlap = small ? -8 : -10;
  const shouldOverlap = cards.length > 2;

  return (
    <div className={`flex flex-col items-center gap-1.5 transition-transform duration-200 ${active ? 'scale-105' : ''}`}>
      {label && (
        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">{label}</div>
      )}
      <div className="flex" style={{ marginLeft: shouldOverlap ? `${-overlap}px` : 0 }}>
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              marginLeft: i > 0 && shouldOverlap ? `${overlap}px` : '2px',
              zIndex: i,
              transform: active && !small ? `translateY(${i === cards.length - 1 ? -2 : 0}px)` : undefined,
            }}
          >
            <Card card={card} hidden={hidden && i === 1} small={small} />
          </div>
        ))}
      </div>
      <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors duration-200 ${
        active
          ? 'bg-gold/20 text-gold border border-gold/30'
          : 'bg-black/30 text-white/80 border border-white/10'
      }`}>
        {displayTotal}
      </div>
    </div>
  );
}
