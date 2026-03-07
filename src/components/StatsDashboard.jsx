import React, { useState } from 'react';
import { loadStats, defaultStats, saveStats, clearStats } from '../utils/storage';

function StatBar({ label, value, max, color = 'bg-emerald-500' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-bold">{pct}%</span>
      </div>
      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

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

  const winRate = stats.handsPlayed > 0
    ? Math.round((stats.wins / stats.handsPlayed) * 100) : 0;
  const strategyAcc = stats.strategyTotal > 0
    ? Math.round((stats.strategyCorrect / stats.strategyTotal) * 100) : 0;
  const countAcc = stats.countGuesses > 0
    ? Math.round((stats.countCorrect / stats.countGuesses) * 100) : 0;
  const betCorrelation = stats.betTotal > 0
    ? Math.round((stats.betCorrect / stats.betTotal) * 100) : 0;
  const deviationAcc = stats.deviationTotal > 0
    ? Math.round((stats.deviationCorrect / stats.deviationTotal) * 100) : 0;
  const avgBigBetTc = stats.bigBetCount > 0
    ? (stats.bigBetTcSum / stats.bigBetCount).toFixed(1) : '—';
  const avgSmallBetTc = stats.smallBetCount > 0
    ? (stats.smallBetTcSum / stats.smallBetCount).toFixed(1) : '—';
  const winRatePositive = stats.handsAtPositive > 0
    ? Math.round((stats.winsAtPositive / stats.handsAtPositive) * 100) : 0;
  const winRateNegative = stats.handsAtNegative > 0
    ? Math.round((stats.winsAtNegative / stats.handsAtNegative) * 100) : 0;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'counting', label: 'Counting' },
    { id: 'betting', label: 'Betting' },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 overflow-y-auto">
      <div className="px-4 pt-4 pb-2 flex items-center">
        <button onClick={onBack} className="text-gray-400 text-sm">&larr; Back</button>
        <h1 className="text-xl font-bold text-white flex-1 text-center pr-8">Statistics</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 mb-3">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${tab === t.id ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-gray-400'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 pb-4 space-y-3">
        {tab === 'overview' && (
          <>
            {/* Key stats grid */}
            <div className="grid grid-cols-3 gap-2">
              <StatCard label="Hands" value={stats.handsPlayed} />
              <StatCard label="Wins" value={stats.wins} color="text-emerald-400" />
              <StatCard label="Losses" value={stats.losses} color="text-red-400" />
              <StatCard label="Pushes" value={stats.pushes} color="text-gray-400" />
              <StatCard label="Blackjacks" value={stats.blackjacks} color="text-yellow-400" />
              <StatCard label="Busts" value={stats.busts} color="text-red-400" />
            </div>

            <div className="bg-black/20 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Net Profit/Loss</span>
                <span className={`text-2xl font-bold ${stats.chips >= 1000 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stats.chips >= 1000 ? '+' : ''}${stats.chips - 1000}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Current Chips</span>
                <span className="text-xl font-bold text-yellow-400">${stats.chips}</span>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-2">Win Rate by Count</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Positive Count</div>
                  <div className="text-lg font-bold text-emerald-400">{winRatePositive}%</div>
                  <div className="text-xs text-gray-500">{stats.handsAtPositive} hands</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Negative Count</div>
                  <div className="text-lg font-bold text-red-400">{winRateNegative}%</div>
                  <div className="text-xs text-gray-500">{stats.handsAtNegative} hands</div>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'strategy' && (
          <>
            <div className="bg-black/20 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-3">Basic Strategy Accuracy</div>
              <div className="text-center mb-4">
                <div className={`text-4xl font-bold ${strategyAcc >= 80 ? 'text-emerald-400' : strategyAcc >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {strategyAcc}%
                </div>
                <div className="text-xs text-gray-500">{stats.strategyCorrect}/{stats.strategyTotal} correct</div>
              </div>

              <div className="text-xs text-gray-400 mb-2">By Hand Type</div>
              <StatBar label="Hard Hands" value={stats.strategyByType?.hard?.correct || 0} max={stats.strategyByType?.hard?.total || 0} />
              <StatBar label="Soft Hands" value={stats.strategyByType?.soft?.correct || 0} max={stats.strategyByType?.soft?.total || 0} color="bg-blue-500" />
              <StatBar label="Pairs" value={stats.strategyByType?.pair?.correct || 0} max={stats.strategyByType?.pair?.total || 0} color="bg-purple-500" />
            </div>

            <div className="bg-black/20 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-3">Illustrious 18 Deviations</div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${deviationAcc >= 80 ? 'text-emerald-400' : deviationAcc >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {deviationAcc}%
                </div>
                <div className="text-xs text-gray-500">{stats.deviationCorrect}/{stats.deviationTotal} correct</div>
              </div>
            </div>
          </>
        )}

        {tab === 'counting' && (
          <>
            <div className="bg-black/20 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-3">Count Quiz Accuracy</div>
              <div className="text-center mb-4">
                <div className={`text-4xl font-bold ${countAcc >= 80 ? 'text-emerald-400' : countAcc >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {countAcc}%
                </div>
                <div className="text-xs text-gray-500">{stats.countCorrect}/{stats.countGuesses} correct</div>
              </div>
            </div>

            {(stats.distractionCountTotal > 0 || stats.normalCountTotal > 0) && (
              <div className="bg-black/20 rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-3">Distractions Impact</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xs text-gray-500">Without Distractions</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {stats.normalCountTotal > 0 ? Math.round((stats.normalCountCorrect / stats.normalCountTotal) * 100) : 0}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">With Distractions</div>
                    <div className="text-lg font-bold text-yellow-400">
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
            <div className="bg-black/20 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-3">Bet Spread Correlation</div>
              <div className="text-center mb-4">
                <div className={`text-4xl font-bold ${betCorrelation >= 80 ? 'text-emerald-400' : betCorrelation >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {betCorrelation}%
                </div>
                <div className="text-xs text-gray-500">{stats.betCorrect}/{stats.betTotal} optimal bets</div>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-3">Avg True Count at Bet Size</div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xs text-gray-500">Big Bets (≥$40)</div>
                  <div className="text-lg font-bold text-emerald-400">TC {avgBigBetTc}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Small Bets (≤$20)</div>
                  <div className="text-lg font-bold text-gray-400">TC {avgSmallBetTc}</div>
                </div>
              </div>
            </div>
          </>
        )}

        <button onClick={handleReset}
          className="w-full py-3 bg-red-900/50 text-red-400 font-medium rounded-xl active:scale-95 mt-4">
          Reset All Stats
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, color = 'text-white' }) {
  return (
    <div className="bg-black/20 rounded-xl p-3 text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}
