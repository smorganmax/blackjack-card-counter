import React, { useState } from 'react';
import { SuitIcon } from './Card';

const SLIDES = [
  {
    title: 'Welcome',
    subtitle: 'Learn to Count Cards',
    body: 'This app teaches you the Hi-Lo card counting system — the most popular and effective method used by professional blackjack players.',
    visual: 'welcome',
  },
  {
    title: 'The Count',
    subtitle: 'Hi-Lo Card Values',
    body: 'Every card has a counting value. Low cards (2-6) add +1 because removing them helps the player. High cards (10-A) subtract -1 because removing them hurts the player.',
    visual: 'count',
  },
  {
    title: 'True Count',
    subtitle: 'Adjusting for Decks',
    body: 'Divide the running count by decks remaining to get the true count. A RC of +4 with 2 decks left = TC +2. The true count tells you your actual edge.',
    visual: 'truecount',
  },
  {
    title: 'Bet Spread',
    subtitle: 'When to Bet Big',
    body: 'Bet more when the true count is high (the deck favors you) and bet minimum when it\'s low or negative. This is where the money is made.',
    visual: 'betting',
  },
  {
    title: 'Let\'s Practice',
    subtitle: 'Start with Training Mode',
    body: 'We\'ll turn on helpful aids to start: the running count display, strategy hints, and bet coaching. Turn them off as you improve.',
    visual: 'practice',
  },
];

function CardExample({ rank, suit, value, color }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-10 h-14 playing-card flex flex-col items-center justify-center">
        <span className={`text-xs font-bold ${suit === '♥' || suit === '♦' ? 'text-[#C41E3A]' : 'text-[#1a1a2e]'}`}>{rank}</span>
        <SuitIcon suit={suit} size={12} />
      </div>
      <span className={`text-xs font-bold ${color}`}>{value}</span>
    </div>
  );
}

function SlideVisual({ type }) {
  switch (type) {
    case 'welcome':
      return (
        <div className="flex justify-center gap-2 my-6">
          {['♠','♥','♦','♣'].map((s, i) => (
            <div key={s} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}>
              <SuitIcon suit={s} size={32} />
            </div>
          ))}
        </div>
      );
    case 'count':
      return (
        <div className="my-6">
          <div className="flex justify-center gap-6 mb-2">
            <div className="text-center">
              <div className="text-[10px] text-gray-500 uppercase mb-2">Low (+1)</div>
              <div className="flex gap-1">
                <CardExample rank="3" suit="♥" value="+1" color="text-emerald-400" />
                <CardExample rank="5" suit="♣" value="+1" color="text-emerald-400" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-gray-500 uppercase mb-2">Neutral</div>
              <div className="flex gap-1">
                <CardExample rank="7" suit="♠" value="0" color="text-gray-400" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-gray-500 uppercase mb-2">High (-1)</div>
              <div className="flex gap-1">
                <CardExample rank="K" suit="♦" value="-1" color="text-red-400" />
                <CardExample rank="A" suit="♠" value="-1" color="text-red-400" />
              </div>
            </div>
          </div>
        </div>
      );
    case 'truecount':
      return (
        <div className="my-6 section-card mx-2">
          <div className="flex items-center justify-center gap-3 text-center">
            <div>
              <div className="text-[10px] text-gray-500">Running Count</div>
              <div className="text-2xl font-bold text-emerald-400">+4</div>
            </div>
            <div className="text-gray-600 text-xl">/</div>
            <div>
              <div className="text-[10px] text-gray-500">Decks Left</div>
              <div className="text-2xl font-bold text-white">2</div>
            </div>
            <div className="text-gray-600 text-xl">=</div>
            <div>
              <div className="text-[10px] text-gray-500">True Count</div>
              <div className="text-2xl font-bold text-gold">+2</div>
            </div>
          </div>
        </div>
      );
    case 'betting':
      return (
        <div className="my-6 mx-2">
          <div className="flex justify-between items-end px-2">
            {[
              { tc: '-1', bet: '$10', h: 'h-6', color: 'bg-gray-600' },
              { tc: '0', bet: '$10', h: 'h-6', color: 'bg-gray-600' },
              { tc: '+1', bet: '$20', h: 'h-10', color: 'bg-emerald-600/60' },
              { tc: '+2', bet: '$40', h: 'h-14', color: 'bg-emerald-600/80' },
              { tc: '+3', bet: '$60', h: 'h-20', color: 'bg-emerald-500' },
              { tc: '+5', bet: '$100', h: 'h-24', color: 'bg-gold' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="text-[9px] text-gray-500 font-medium">{item.bet}</div>
                <div className={`w-6 ${item.h} ${item.color} rounded-t-md`} />
                <div className="text-[9px] text-gray-400">{item.tc}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-[10px] text-gray-600 mt-2">True Count</div>
        </div>
      );
    case 'practice':
      return (
        <div className="my-6 flex justify-center gap-3">
          {['Count Display', 'Strategy Hints', 'Bet Coach'].map((label, i) => (
            <div key={i} className="section-card px-3 py-2.5 text-center animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}>
              <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-1">
                <span className="text-emerald-400 text-xs font-bold">✓</span>
              </div>
              <div className="text-[10px] text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function Tutorial({ onComplete }) {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-casino-black via-casino-slate to-casino-black">
      <div className="flex-1 flex flex-col items-center justify-center px-8 animate-screen-enter" key={slide}>
        <div className="text-gold text-xs uppercase tracking-widest font-semibold mb-2">{current.subtitle}</div>
        <h1 className="text-2xl font-bold text-white mb-1">{current.title}</h1>

        <SlideVisual type={current.visual} />

        <p className="text-gray-400 text-sm text-center leading-relaxed max-w-xs">{current.body}</p>
      </div>

      <div className="px-6 pb-8">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
              i === slide ? 'w-6 bg-gold' : 'w-1.5 bg-white/20'
            }`} />
          ))}
        </div>

        <button
          onClick={() => isLast ? onComplete() : setSlide(s => s + 1)}
          className="w-full py-4 bg-gradient-to-b from-emerald-500 to-emerald-600 text-white font-bold text-base rounded-2xl
                     shadow-lg shadow-emerald-500/20 active:scale-[0.96] transition-all border border-emerald-400/20"
        >
          {isLast ? 'Start Training' : 'Continue'}
        </button>

        {!isLast && (
          <button
            onClick={onComplete}
            className="w-full py-3 text-gray-500 text-sm font-medium mt-2 active:text-gray-300"
          >
            Skip Tutorial
          </button>
        )}
      </div>
    </div>
  );
}
