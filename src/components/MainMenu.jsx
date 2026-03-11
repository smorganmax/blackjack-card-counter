import React from 'react';

export default function MainMenu({ onNavigate }) {
  const menuItems = [
    { id: 'play', label: 'Play Blackjack', desc: 'Full game with card counting', icon: '🃏', color: 'bg-emerald-600' },
    { id: 'countQuiz', label: 'Count Quiz', desc: 'Test your counting in-game', icon: '🧠', color: 'bg-blue-600' },
    { id: 'speedDrill', label: 'Speed Drills', desc: 'Flash cards & group counting', icon: '⚡', color: 'bg-purple-600' },
    { id: 'guide', label: 'Hi-Lo Guide', desc: 'Learn the counting system', icon: '📖', color: 'bg-teal-600' },
    { id: 'stats', label: 'Statistics', desc: 'Track your improvement', icon: '📊', color: 'bg-yellow-600' },
    { id: 'settings', label: 'Settings', desc: 'Configure training options', icon: '⚙', color: 'bg-slate-600' },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 overflow-y-auto">
      <div className="text-center pt-8 pb-6 slide-up">
        <h1 className="text-4xl font-bold text-white mb-1">Blackjack</h1>
        <h2 className="text-lg text-emerald-400 font-medium">Card Counter Trainer</h2>
        <p className="text-xs text-gray-500 mt-2">Hi-Lo System &bull; 2-Deck Shoe</p>
      </div>

      <div className="px-4 space-y-3 pb-8">
        {menuItems.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl ${item.color} hover:brightness-110 active:scale-[0.98] transition-all shadow-lg slide-up`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <span className="text-2xl">{item.icon}</span>
            <div className="text-left">
              <div className="text-white font-bold">{item.label}</div>
              <div className="text-white/60 text-xs">{item.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto pb-6 text-center">
        <div className="text-xs text-gray-600 mb-1">Hi-Lo Count Values</div>
        <div className="flex justify-center gap-4 text-xs">
          <span className="text-emerald-400">2-6: +1</span>
          <span className="text-gray-400">7-9: 0</span>
          <span className="text-red-400">10-A: -1</span>
        </div>
      </div>
    </div>
  );
}
