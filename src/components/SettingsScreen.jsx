import React from 'react';

function Toggle({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
      <div>
        <div className="text-white text-sm font-medium">{label}</div>
        {desc && <div className="text-gray-500 text-xs">{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-emerald-500' : 'bg-slate-600'}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${value ? 'translate-x-5.5 left-[1px]' : 'left-[2px]'}`}
          style={{ transform: value ? 'translateX(21px)' : 'translateX(0)' }} />
      </button>
    </div>
  );
}

export default function SettingsScreen({ settings, onUpdateSettings, onBack }) {
  const update = (key, value) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 overflow-y-auto">
      <div className="px-4 pt-4 pb-2 flex items-center">
        <button onClick={onBack} className="text-gray-400 text-sm">&larr; Back</button>
        <h1 className="text-xl font-bold text-white flex-1 text-center pr-8">Settings</h1>
      </div>

      <div className="px-4 pb-6">
        <div className="text-xs text-gray-500 uppercase tracking-wide mt-4 mb-1">Count Display</div>
        <Toggle label="Show Running Count" desc="Display count during gameplay" value={settings.showCount} onChange={v => update('showCount', v)} />

        <div className="text-xs text-gray-500 uppercase tracking-wide mt-6 mb-1">Training Aids</div>
        <Toggle label="Strategy Helper" desc="Show correct move before acting" value={settings.strategyHelper} onChange={v => update('strategyHelper', v)} />
        <Toggle label="Bet Coaching" desc="Show recommended bet before betting" value={settings.betCoaching} onChange={v => update('betCoaching', v)} />
        <Toggle label="Deviation Alerts" desc="Highlight Illustrious 18 situations" value={settings.deviationAlerts} onChange={v => update('deviationAlerts', v)} />

        <div className="text-xs text-gray-500 uppercase tracking-wide mt-6 mb-1">Advanced Training</div>
        <Toggle label="Casino Distractions" desc="Random distractions to test focus" value={settings.casinoDistractions} onChange={v => update('casinoDistractions', v)} />

        <div className="text-xs text-gray-500 uppercase tracking-wide mt-6 mb-1">Indicators</div>
        <Toggle label="Shoe Penetration" desc="Show dealing depth and player edge" value={settings.showPenetration} onChange={v => update('showPenetration', v)} />
        <Toggle label="Count Reliability" desc="Show count reliability indicator" value={settings.showReliability} onChange={v => update('showReliability', v)} />

        <div className="text-xs text-gray-500 uppercase tracking-wide mt-6 mb-1">Shoe Settings</div>
        <div className="py-3">
          <div className="text-white text-sm font-medium mb-2">Reshuffle Penetration: {settings.penetrationPercent}%</div>
          <input
            type="range"
            min="50"
            max="90"
            step="5"
            value={settings.penetrationPercent}
            onChange={e => update('penetrationPercent', parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>50%</span>
            <span>90%</span>
          </div>
        </div>

        <div className="py-3">
          <div className="text-white text-sm font-medium mb-2">Count Quiz Interval: Every {settings.countQuizInterval} hands</div>
          <div className="flex gap-2">
            {[3, 5, 7, 10].map(n => (
              <button key={n} onClick={() => update('countQuizInterval', n)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold ${settings.countQuizInterval === n ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-gray-400'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
