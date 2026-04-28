import React from 'react';
import { suitColor } from '../utils/deck';

const SUIT_PATHS = {
  '♠': 'M8 1.5C8 1.5 1 8 1 11c0 2.5 2 4 3.5 4 1 0 2-.5 2.5-1.5-.5 2-2 3.5-2 3.5h6s-1.5-1.5-2-3.5c.5 1 1.5 1.5 2.5 1.5 1.5 0 3.5-1.5 3.5-4C15 8 8 1.5 8 1.5z',
  '♥': 'M8 15C8 15 1.5 9.5 1.5 6c0-2.5 2-4.5 3.5-4.5C6.5 1.5 7.5 2.5 8 4c.5-1.5 1.5-2.5 3-2.5 1.5 0 3.5 2 3.5 4.5C14.5 9.5 8 15 8 15z',
  '♦': 'M8 1L14.5 8L8 15L1.5 8L8 1z',
  '♣': 'M8 14.5h-2s.5-2 0-3.5C4.5 12 2 11.5 2 9c0-2 1.5-3.5 3-3.5.5 0 1.5.5 2 1-1-1.5-1-4 1-5.5 2 1.5 2 4 1 5.5.5-.5 1.5-1 2-1 1.5 0 3 1.5 3 3.5 0 2.5-2.5 3-4 2 .5 1.5 0 3.5 0 3.5H8z',
};

function SuitIcon({ suit, size = 16, className = '' }) {
  const isRed = suit === '♥' || suit === '♦';
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className}>
      <path d={SUIT_PATHS[suit]} fill={isRed ? '#C41E3A' : '#1a1a2e'} />
    </svg>
  );
}

function CenterPips({ rank, suit, small }) {
  const s = small ? 10 : 14;
  const faces = { J: 'J', Q: 'Q', K: 'K' };

  if (rank === 'A') {
    return (
      <div className="flex items-center justify-center flex-1">
        <SuitIcon suit={suit} size={small ? 24 : 36} />
      </div>
    );
  }

  if (faces[rank]) {
    const isRed = suit === '♥' || suit === '♦';
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <span className={`font-bold ${small ? 'text-lg' : 'text-2xl'} ${isRed ? 'text-[#C41E3A]' : 'text-[#1a1a2e]'}`}>
          {rank}
        </span>
        <SuitIcon suit={suit} size={small ? 14 : 18} />
      </div>
    );
  }

  const num = parseInt(rank, 10) || 10;
  const pipSize = small ? 7 : s - 4;

  const layouts = {
    2: [[50,25],[50,75]],
    3: [[50,20],[50,50],[50,80]],
    4: [[30,25],[70,25],[30,75],[70,75]],
    5: [[30,20],[70,20],[50,50],[30,80],[70,80]],
    6: [[30,20],[70,20],[30,50],[70,50],[30,80],[70,80]],
    7: [[30,20],[70,20],[50,35],[30,50],[70,50],[30,80],[70,80]],
    8: [[30,18],[70,18],[50,32],[30,50],[70,50],[50,68],[30,82],[70,82]],
    9: [[30,18],[70,18],[30,40],[70,40],[50,50],[30,62],[70,62],[30,82],[70,82]],
    10: [[30,15],[70,15],[50,28],[30,40],[70,40],[30,60],[70,60],[50,72],[30,85],[70,85]],
  };

  const positions = layouts[num] || layouts[10];

  return (
    <div className="flex-1 relative">
      {positions.map(([x, y], i) => (
        <div key={i} className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}>
          <SuitIcon suit={suit} size={pipSize} />
        </div>
      ))}
    </div>
  );
}

export default function Card({ card, hidden = false, small = false }) {
  const w = small ? 'w-11 h-16' : 'w-[60px] h-[84px]';

  if (hidden) {
    return (
      <div className={`${w} card-back animate-deal-card flex items-center justify-center`}>
        <div className="w-5 h-5 rounded-full border border-white/10" />
      </div>
    );
  }

  const isRed = suitColor(card.suit) === 'red';
  const color = isRed ? 'text-[#C41E3A]' : 'text-[#1a1a2e]';
  const cornerSize = small ? 'text-[9px]' : 'text-[11px]';

  return (
    <div className={`${w} playing-card animate-deal-card flex flex-col p-[3px] select-none`}>
      <div className={`flex flex-col items-center leading-none ${color} ${cornerSize} font-bold`}>
        <span>{card.rank}</span>
        <SuitIcon suit={card.suit} size={small ? 7 : 9} />
      </div>

      <CenterPips rank={card.rank} suit={card.suit} small={small} />

      <div className={`flex flex-col items-center leading-none ${color} ${cornerSize} font-bold rotate-180`}>
        <span>{card.rank}</span>
        <SuitIcon suit={card.suit} size={small ? 7 : 9} />
      </div>
    </div>
  );
}

export { SuitIcon };
