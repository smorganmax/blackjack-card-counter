import React, { useState } from 'react';
import ScreenTransition from './ScreenTransition';
import { loadStats, defaultStats, saveStats, clearStats } from '../utils/storage';

function StatBar({ label, value, max, color = 'bg-emerald-500' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-bold tabular-nums">{pct}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full animate-bar-fill`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function RingChart({ percentage, color, size = 64, stroke = 5 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        className="transition-all duration-700" />
    </svg>
  );
}

function StatCard({ label, value, color = 'text-white' }) {
  return (
    <div className="section-card text-center">
      <div className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-lg font-bold ${color} tabular-nums`}>{value}</div>
    </div>
  );
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'counting', label: 'Counting' },
  { id: 'betting', label: 'Betting' },
];

export default function StatsDashboard({ onBack }) {
  const [stats, setStats] = useState(() => loadStats());
  const [tab, setTab] = useState('overview');

  const handleReset = () => {
    if (confirm('Reset all statistics? This cannot be undone.')) {
      const fresh = defaultStats();
      saveStats(fresh);
      clearStats();
      setStats(fresh);
    }
  };

  const winRate = stats.handsPlayed > 0 ? Math.round((stats.wins / stats.handsPlayed) * 100) : 0;
  const strategyAcc = stats.strategyTotal > 0 ? Math.round((stats.strategyCorrect / stats.strategyTotal) * 100) : 0;
  const countAcc = stats.countGuesses > 0 ? Math.round((stats.countCorrect / stats.countGuesses) * 100) : 0;
  const betCorrelation = stats.betTotal > 0 ? Math.round((stats.betCorrect / stats.betTotal) * 100) : 0;
  const deviationAcc = stats.deviationTotal > 0 ? Math.round((stats.deviationCorrect / stats.deviationTotal) * 100) : 0;
  const avgBigBetTc = stats.bigBetCount > 0 ? (stats.bigBetTcSum / stats.bigBetCount).toFixed(1) : '--';
  const avgSmallBetTc = stats.smallBetCount > 0 ? (stats.smallBetTcSum / stats.smallBetCount).toFixed(1) : '--';
  const winRatePositive = stats.handsAtPositive > 0 ? Math.round((stats.winsAtPositive / stats.handsAtPositive) * 100) : 0;
  const winRateNegative = stats.handsAtNegative > 0 ? Math.round((stats.winsAtNegative / stats.handsAtNegative) * 100) : 0;

  const accColor = (pct) => pct >= 80 ? '#10b981' : pct >= 60 ? '#eab308' : '#ef4444';

  return (
    <ScreenTransition>
      <div className="flex flex-col h-full bg-gradient-to-b from-casino-black to-casino-slate overflow-y-auto hide-scrollbar">
        <div className="px-4 pt-4 pb-2 flex items-center">
          <button onClick={onBack} className="text-gray-400 text-sm font-medium active:text-white transition-colors">
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} className="inline mr-1"><path d="M15 18l-6-6 6-6" /></svg>
            Back
          </button>
          <h1 className="text-lg font-bold text-white flex-1 text-center pr-8">Statistics</h1>
        </div>

        {/* Tabs */}
        <div className="mx-4 mb-3 bg-white/5 rounded-xl p-1 flex">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                ${tab === t.id ? 'segment-active' : 'segment-inactive'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="px-4 pb-6 space-y-3">
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <StatCard label="Hands" value={stats.handsPlayed} />
                <StatCard label="Wins" value={stats.wins} color="text-emerald-400" />
                <StatCard label="Losses" value={stats.losses} color="text-red-400" />
                <StatCard label="Pushes" value={stats.pushes} color="text-gray-400" />
                <StatCard label="BJacks" value={stats.blackjacks} color="text-gold" />
                <StatCard label="Busts" value={stats.busts} color="text-red-400" />
              </div>

              <div className="section-card">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400 text-sm">Net Profit/Loss</span>
                  <span className={`text-2xl font-bold tabular-nums ${stats.chips >= 1000 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stats.chips >= 1000 ? '+' : ''}${stats.chips - 1000}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Current Chips</span>
                  <span className="text-xl font-bold text-gold tabular-nums">${stats.chips}</span>
                </div>
              </div>

              <div className="section-card">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Win Rate by Count</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="relative inline-block mb-1">
                      <RingChart percentage={winRatePositive} color="#10b981" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-emerald-400 tabular-nums">{winRatePositive}%</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-500">Positive Count</div>
                    <div className="text-[10px] text-gray-600">{stats.handsAtPositive} hands</div>
                  </div>
                  <div className="text-center">
                    <div className="relative inline-block mb-1">
                      <RingChart percentage={winRateNegative} color="#ef4444" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-red-400 tabular-nums">{winRateNegative}%</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-500">Negative Count</div>
                    <div className="text-[10px] text-gray-600">{stats.handsAtNegative} hands</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'strategy' && (
            <>
              <div className="section-card">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Basic Strategy</div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <RingChart percentage={strategyAcc} color={accColor(strategyAcc)} size={80} stroke={6} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-white tabular-nums">{strategyAcc}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{stats.strategyCorrect}/{stats.strategyTotal}</div>
                    <div className="text-xs text-gray-500">correct decisions</div>
                  </div>
                </div>
                <StatBar label="Hard Hands" value={stats.strategyByType?.hard?.correct || 0} max={stats.strategyByType?.hard?.total || 0} />
                <StatBar label="Soft Hands" value={stats.strategyByType?.soft?.correct || 0} max={stats.strategyByType?.soft?.total || 0} color="bg-blue-500" />
                <StatBar label="Pairs" value={stats.strategyByType?.pair?.correct || 0} max={stats.strategyByType?.pair?.total || 0} color="bg-purple-500" />
              </div>

              <div className="section-card">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Illustrious 18</div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <RingChart percentage={deviationAcc} color={accColor(deviationAcc)} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white tabular-nums">{deviationAcc}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{stats.deviationCorrect}/{stats.deviationTotal}</div>
                    <div className="text-xs text-gray-500">correct deviations</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'counting' && (
            <>
              <div className="section-card">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Count Quiz Accuracy</div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="relative">
                    <RingChart percentage={countAcc} color={accColor(countAcc)} size={80} stroke={6} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-white tabular-nums">{countAcc}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{stats.countCorrect}/{stats.countGuesses}</div>
                    <div className="text-xs text-gray-500">correct counts</div>
                  </div>
                </div>
              </div>

              {(stats.distractionCountTotal > 0 || stats.normalCountTotal > 0) && (
                <div className="section-card">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Distractions Impact</div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-[10px] text-gray-500 mb-1">Without</div>
                      <div className="text-xl font-bold text-emerald-400 tabular-nums">
                        {stats.normalCountTotal > 0 ? Math.round((stats.normalCountCorrect / stats.normalCountTotal) * 100) : 0}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 mb-1">With</div>
                      <div className="text-xl font-bold text-amber-400 tabular-nums">
                        {stats.distractionCountTotal > 0 ? Math.round((stats.distractionCountCorrect / stats.distractionCountTotal) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {tab === 'betting' && (
            <>
              <div className="section-card">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Bet Spread Correlation</div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="relative">
                    <RingChart percentage={betCorrelation} color={accColor(betCorrelation)} size={80} stroke={6} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-white tabular-nums">{betCorrelation}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{stats.betCorrect}/{stats.betTotal}</div>
                    <div className="text-xs text-gray-500">optimal bets</div>
                  </div>
                </div>
              </div>

              <div className="section-card">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Avg TC at Bet Size</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">Big Bets ($40+)</div>
                    <div className="text-xl font-bold text-emerald-400 tabular-nums">TC {avgBigBetTc}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-1">Small Bets ($20-)</div>
                    <div className="text-xl font-bold text-gray-400 tabular-nums">TC {avgSmallBetTc}</div>
                  </div>
                </div>
              </div>
            </>
          )}

          <button onClick={handleReset}
            className="w-full py-3 bg-red-900/20 text-red-400 font-medium rounded-2xl active:scale-[0.98] border border-red-800/20 mt-2">
            Reset All Stats
          </button>
        </div>
      </div>
    </ScreenTransition>
  );
}
