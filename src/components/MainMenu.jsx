import React from 'react';
import ScreenTransition from './ScreenTransition';
import { SuitIcon } from './Card';

function SpadeIcon() {
  return (
    <svg viewBox="0 0 16 16" width={20} height={20}>
      <path d="M8 1.5C8 1.5 1 8 1 11c0 2.5 2 4 3.5 4 1 0 2-.5 2.5-1.5-.5 2-2 3.5-2 3.5h6s-1.5-1.5-2-3.5c.5 1 1.5 1.5 2.5 1.5 1.5 0 3.5-1.5 3.5-4C15 8 8 1.5 8 1.5z" fill="currentColor" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 015 5c0 1.5-.5 2.5-1 3.5.5 1 1 2 1 3.5a5 5 0 01-5 5" />
      <path d="M12 2a5 5 0 00-5 5c0 1.5.5 2.5 1 3.5-.5 1-1 2-1 3.5a5 5 0 005 5" />
      <path d="M12 2v17" />
      <path d="M7 8h10M7 13h10" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
      <path d="M13 2L4 14h7v8l9-12h-7V2z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="12" width="4" height="9" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="10" y="6" width="4" height="15" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="17" y="2" width="4" height="19" rx="1" fill="currentColor" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

const menuItems = [
  { id: 'play', label: 'Play Blackjack', desc: 'Full game with card counting', icon: SpadeIcon, gradient: 'from-emerald-600 to-emerald-700', border: 'border-emerald-500/20' },
  { id: 'countQuiz', label: 'Count Quiz', desc: 'Test your counting in-game', icon: BrainIcon, gradient: 'from-blue-600 to-blue-700', border: 'border-blue-500/20' },
  { id: 'speedDrill', label: 'Speed Drills', desc: 'Flash cards & group counting', icon: BoltIcon, gradient: 'from-purple-600 to-purple-700', border: 'border-purple-500/20' },
  { id: 'stats', label: 'Statistics', desc: 'Track your improvement', icon: ChartIcon, gradient: 'from-amber-600 to-amber-700', border: 'border-amber-500/20' },
  { id: 'settings', label: 'Settings', desc: 'Configure training options', icon: GearIcon, gradient: 'from-slate-600 to-slate-700', border: 'border-slate-500/20' },
];

export default function MainMenu({ onNavigate }) {
  return (
    <ScreenTransition>
      <div className="flex flex-col h-full bg-gradient-to-b from-casino-black via-casino-slate to-casino-black overflow-y-auto hide-scrollbar">
        <div className="text-center pt-10 pb-8">
          <div className="flex justify-center gap-1 mb-3 opacity-30">
            {['♠','♥','♣','♦'].map(s => (
              <SuitIcon key={s} suit={s} size={12} />
            ))}
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Blackjack</h1>
          <h2 className="text-base text-gold font-semibold tracking-wide mt-0.5">Card Counter Trainer</h2>
          <p className="text-[11px] text-gray-500 mt-2 tracking-widest uppercase">Hi-Lo System &bull; 2-Deck Shoe</p>
        </div>

        <div className="px-5 space-y-2.5 pb-8">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${item.gradient}
                  border ${item.border} active:scale-[0.98] transition-all duration-150 shadow-lg animate-slide-up`}
                style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'both' }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/90">
                  <Icon />
                </div>
                <div className="text-left flex-1">
                  <div className="text-white font-semibold text-[15px]">{item.label}</div>
                  <div className="text-white/50 text-xs">{item.desc}</div>
                </div>
                <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pb-8 px-5">
          <div className="section-card p-3">
            <div className="text-[10px] text-gray-500 text-center mb-2 uppercase tracking-widest">Hi-Lo Count Values</div>
            <div className="flex justify-center gap-6 text-xs font-medium">
              <span className="text-emerald-400">2-6: +1</span>
              <span className="text-gray-500">7-9: 0</span>
              <span className="text-red-400">10-A: -1</span>
            </div>
          </div>
        </div>
      </div>
    </ScreenTransition>
  );
}
