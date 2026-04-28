import React, { useEffect } from 'react';
import Hand from './Hand';
import Controls from './Controls';
import CountDisplay from './CountDisplay';
import PenetrationIndicator from './PenetrationIndicator';
import StrategyHelper from './StrategyHelper';
import StrategyFeedback from './StrategyFeedback';
import { handTotal, canSplit as canSplitCheck, canDoubleDown, isBlackjack, isBust } from '../utils/hand';

export default function GameTable({
  dealerHand,
  dealerHidden,
  playerHands,
  otherPlayers,
  activeHandIndex,
  phase,
  showCount,
  runningCount,
  trueCount,
  shoeSize,
  message,
  insuranceOffered,
  settings,
  strategyFeedback,
  deviationFeedback,
  onHit,
  onStand,
  onDouble,
  onSplit,
  onInsurance,
  onDeclineInsurance,
  onDealerPlay,
  onToggleCount,
  PHASES
}) {
  useEffect(() => {
    if (phase === PHASES.DEALER_TURN) {
      const timer = setTimeout(onDealerPlay, 600);
      return () => clearTimeout(timer);
    }
  }, [phase, onDealerPlay, PHASES]);

  useEffect(() => {
    if (phase === PHASES.PLAYER_TURN && playerHands.length === 1 && isBlackjack(playerHands[0].cards)) {
      const timer = setTimeout(onStand, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, playerHands, onStand, PHASES]);

  const activeHand = playerHands[activeHandIndex];
  const canHit = phase === PHASES.PLAYER_TURN && activeHand && !isBust(activeHand.cards) && handTotal(activeHand.cards) < 21;
  const canDbl = canHit && canDoubleDown(activeHand.cards);
  const canSpl = canHit && canSplitCheck(activeHand.cards);
  const canStnd = phase === PHASES.PLAYER_TURN && activeHand && !isBust(activeHand.cards);

  return (
    <div className="flex flex-col h-full felt-bg relative overflow-hidden">
      {/* Table arc decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-40 border-b-2 border-emerald-700/30 rounded-b-[50%] -translate-y-20" />

      {/* Top bar */}
      <div className="flex justify-between items-center px-4 pt-2.5 pb-1 relative z-10">
        <button
          onClick={onToggleCount}
          className="text-[11px] px-3 py-1.5 rounded-full glass text-gray-300 active:bg-white/10 transition-colors"
        >
          {showCount ? 'Hide Count' : 'Show Count'}
        </button>
        <PenetrationIndicator
          shoeSize={shoeSize}
          trueCount={trueCount}
          showPenetration={settings?.showPenetration}
          showReliability={settings?.showReliability}
          compact
        />
      </div>

      {/* Count display */}
      {showCount && (
        <CountDisplay runningCount={runningCount} trueCount={trueCount} />
      )}

      {/* Dealer area */}
      <div className="flex-shrink-0 flex justify-center pt-2 pb-3 relative z-10">
        {dealerHand.length > 0 && (
          <Hand cards={dealerHand} hidden={dealerHidden} label="Dealer" />
        )}
      </div>

      {/* Other players */}
      {otherPlayers.length > 0 && (
        <div className="flex justify-center gap-3 px-3 pb-2 overflow-x-auto hide-scrollbar">
          {otherPlayers.map((hand, i) => (
            <div key={i} className="opacity-50 flex-shrink-0">
              <Hand cards={hand} label={`P${i + 1}`} small />
            </div>
          ))}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Strategy feedback */}
      <StrategyFeedback feedback={strategyFeedback} deviationFeedback={deviationFeedback} />

      {/* Message */}
      {message && (
        <div className="text-center py-1.5 animate-pop-in">
          <span className="text-gold font-bold text-lg">{message}</span>
        </div>
      )}

      {/* Insurance prompt */}
      {insuranceOffered && phase === PHASES.PLAYER_TURN && (
        <div className="flex justify-center gap-3 py-3 px-4 animate-slide-up">
          <button
            onClick={() => onInsurance(true)}
            className="flex-1 py-3.5 bg-gradient-to-b from-amber-500 to-amber-600 text-white font-bold rounded-2xl active:scale-[0.96] shadow-lg border border-amber-400/20"
          >
            Take Insurance
          </button>
          <button
            onClick={onDeclineInsurance}
            className="flex-1 py-3.5 glass text-white font-bold rounded-2xl active:scale-[0.96]"
          >
            No Thanks
          </button>
        </div>
      )}

      {/* Player hands */}
      <div className="flex-shrink-0 flex justify-center gap-5 px-3 pb-1.5">
        {playerHands.map((hand, i) => (
          <div key={i} className={`${i === activeHandIndex && phase === PHASES.PLAYER_TURN ? 'animate-pulse-glow rounded-2xl p-1.5' : 'p-1.5'}`}>
            <Hand
              cards={hand.cards}
              label={playerHands.length > 1 ? `Hand ${i + 1} ($${hand.bet})` : `You ($${hand.bet})`}
              active={i === activeHandIndex && phase === PHASES.PLAYER_TURN}
            />
          </div>
        ))}
      </div>

      {/* Strategy helper */}
      {phase === PHASES.PLAYER_TURN && !insuranceOffered && activeHand && (
        <StrategyHelper
          playerCards={activeHand.cards}
          dealerUpcard={dealerHand[0]}
          trueCount={trueCount}
          helperMode={settings?.strategyHelperMode || (settings?.strategyHelper ? 'training' : 'off')}
          deviationAlerts={settings?.deviationAlerts}
        />
      )}

      {/* Controls */}
      {phase === PHASES.PLAYER_TURN && !insuranceOffered && (
        <Controls
          canHit={canHit}
          canStand={canStnd}
          canDouble={canDbl}
          canSplit={canSpl}
          onHit={onHit}
          onStand={onStand}
          onDouble={onDouble}
          onSplit={onSplit}
        />
      )}

      {phase === PHASES.DEALER_TURN && (
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-gray-300 text-sm font-medium">Dealer playing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
