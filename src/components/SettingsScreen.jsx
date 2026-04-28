import React from 'react';
import ScreenTransition from './ScreenTransition';

function Toggle({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div className="flex-1 mr-4">
        <div className="text-white text-sm font-medium">{label}</div>
        {desc && <div className="text-gray-500 text-xs mt-0.5">{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`toggle-track flex-shrink-0 ${value ? 'bg-emerald-500' : 'bg-gray-600'}`}
      >
        <div className="toggle-thumb" style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }} />
      </button>
    </div>
  );
}

function OptionSelector({ label, desc, options, value, onChange }) {
  return (
    <div className="py-3.5">
      <div className="text-white text-sm font-medium">{label}</div>
      {desc && <div className="text-gray-500 text-xs mt-0.5 mb-2">{desc}</div>}
      <div className="flex gap-1.5 mt-2 bg-white/5 rounded-xl p-1">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200
              ${value === opt.value ? 'segment-active' : 'segment-inactive'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-6 mb-1 px-1">
      {children}
    </div>
  );
}

export default function SettingsScreen({ settings, onUpdateSettings, onBack, onResetTutorial }) {
  const update = (key, value) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <ScreenTransition>
      <div className="flex flex-col h-full bg-gradient-to-b from-casino-black to-casino-slate overflow-y-auto hide-scrollbar">
        <div className="px-4 pt-4 pb-2 flex items-center">
          <button onClick={onBack} className="text-gray-400 text-sm font-medium active:text-white transition-colors">
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} className="inline mr-1"><path d="M15 18l-6-6 6-6" /></svg>
            Back
          </button>
          <h1 className="text-lg font-bold text-white flex-1 text-center pr-8">Settings</h1>
        </div>

        <div className="px-4 pb-8">
          <SectionHeader>Count Display</SectionHeader>
          <div className="section-card">
            <Toggle label="Show Running Count" desc="Display count during gameplay" value={settings.showCount} onChange={v => update('showCount', v)} />
          </div>

          <SectionHeader>Strategy Training</SectionHeader>
          <div className="section-card">
            <OptionSelector
              label="Strategy Helper"
              desc="How much help do you want during play?"
              options={[
                { value: 'training', label: 'Show Move' },
                { value: 'hints', label: 'Hint Button' },
                { value: 'off', label: 'Off' },
              ]}
              value={settings.strategyHelperMode || (settings.strategyHelper ? 'training' : 'off')}
              onChange={v => {
                update('strategyHelperMode', v);
                update('strategyHelper', v !== 'off');
              }}
            />
            <div className="border-t border-white/5" />
            <Toggle label="Bet Coaching" desc="Show recommended bet spread" value={settings.betCoaching} onChange={v => update('betCoaching', v)} />
            <div className="border-t border-white/5" />
            <Toggle label="Deviation Alerts" desc="Highlight Illustrious 18 plays" value={settings.deviationAlerts} onChange={v => update('deviationAlerts', v)} />
          </div>

          <SectionHeader>Challenge Mode</SectionHeader>
          <div className="section-card">
            <Toggle label="Casino Distractions" desc="Random distractions to test focus" value={settings.casinoDistractions} onChange={v => update('casinoDistractions', v)} />
          </div>

          <SectionHeader>Display</SectionHeader>
          <div className="section-card">
            <Toggle label="Shoe Penetration" desc="Show dealing depth and player edge" value={settings.showPenetration} onChange={v => update('showPenetration', v)} />
            <div className="border-t border-white/5" />
            <Toggle label="Count Reliability" desc="Show count reliability indicator" value={settings.showReliability} onChange={v => update('showReliability', v)} />
          </div>

          <SectionHeader>Shoe Settings</SectionHeader>
          <div className="section-card">
            <div className="py-3.5">
              <div className="flex justify-between items-center mb-3">
                <div className="text-white text-sm font-medium">Reshuffle Penetration</div>
                <span className="text-gold font-bold text-sm tabular-nums">{settings.penetrationPercent}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={settings.penetrationPercent}
                onChange={e => update('penetrationPercent', parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 h-1"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>50%</span>
                <span>90%</span>
              </div>
            </div>

            <div className="border-t border-white/5" />

            <div className="py-3.5">
              <div className="text-white text-sm font-medium mb-3">Count Quiz Interval</div>
              <div className="flex gap-2">
                {[3, 5, 7, 10].map(n => (
                  <button key={n} onClick={() => update('countQuizInterval', n)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                      ${settings.countQuizInterval === n
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white/5 text-gray-400 active:bg-white/10'
                      }`}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-gray-600 mt-1.5 text-center">hands between quizzes</div>
            </div>
          </div>

          {onResetTutorial && (
            <>
              <SectionHeader>Other</SectionHeader>
              <div className="section-card">
                <button
                  onClick={onResetTutorial}
                  className="w-full py-3 text-blue-400 text-sm font-medium text-left active:text-blue-300"
                >
                  Show Tutorial Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </ScreenTransition>
  );
}
