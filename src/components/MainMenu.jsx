import React from 'react';

export default function MainMenu({ onNavigate }) {
  const menuItems = [
    { id: 'play', label: 'Play Blackjack', desc: 'Full game with card counting', icon: '🃏', color: 'from-emerald-700 to-emerald-600' },
    { id: 'countQuiz', label: 'Count Quiz', desc: 'Test your counting in-game', icon: '🧠', color: 'from-blue-700 to-blue-600' },
    { id: 'speedDrill', label: 'Speed Drills', desc: 'Flash cards & group counting', icon: '⚡', color: 'from-purple-700 to-purple-600' },
    { id: 'stats', label: 'Statistics', desc: 'Track your improvement', icon: '📊', color: 'from-yellow-700 to-yellow-600' },
    { id: 'settings', label: 'Settings', desc: 'Configure training options', icon: '⚙️', color: 'from-slate-700 to-slate-600' },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto">
      {/* Header */}
      <div className="text-center pt-10 pb-6 slide-up px-4">
        <div className="text-5xl mb-3">🃏</div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-1">Blackjack</h1>
        <h2 className="text-lg text-emerald-400 font-semibold">Card Counter Trainer</h2>
        <div className="flex justify-center gap-3 mt-3">
          <span className="text-xs bg-emerald-900/40 text-emerald-400 px-3 py-1 rounded-full border border-emerald-700/40">Hi-Lo System</span>
          <span className="text-xs bg-slate-700/50 text-gray-400 px-3 py-1 rounded-full border border-slate-600/40">2-Deck Shoe</span>
        </div>
      </div>

      <div className="px-4 space-y-2.5 pb-6">
        {menuItems.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${item.color} hover:brightness-110 active:scale-[0.98] transition-all shadow-lg slide-up`}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{item.icon}</span>
            </div>
            <div className="text-left flex-1">
              <div className="text-white font-bold text-base">{item.label}</div>
              <div className="text-white/60 text-xs mt-0.5">{item.desc}</div>
            </div>
            <span className="text-white/40 text-lg">›</span>
          </button>
        ))}
      </div>

      <div className="mt-auto pb-8 text-center px-4">
        <div className="text-xs text-gray-600 mb-2 uppercase tracking-wide">Hi-Lo Count Values</div>
        <div className="flex justify-center gap-2">
          <span className="text-xs bg-emerald-900/30 text-emerald-400 px-3 py-1.5 rounded-lg font-bold">2–6 &nbsp;+1</span>
          <span className="text-xs bg-slate-700/30 text-gray-400 px-3 py-1.5 rounded-lg font-bold">7–9 &nbsp;&nbsp;0</span>
          <span className="text-xs bg-red-900/30 text-red-400 px-3 py-1.5 rounded-lg font-bold">10–A −1</span>
        </div>
      </div>
    </div>
  );
}
