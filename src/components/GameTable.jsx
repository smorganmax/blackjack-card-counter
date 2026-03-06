import React, { useEffect } from 'react';
import Hand from './Hand';
import Controls from './Controls';
import CountDisplay from './CountDisplay';
import { handTotal, canSplit, canDoubleDown, isBlackjack, isBust } from '../utils/hand';
import { shoeProgress } from '../utils/counting';

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
  // Auto-trigger dealer play
  useEffect(() => {
    if (phase === PHASES.DEALER_TURN) {
      const timer = setTimeout(onDealerPlay, 600);
      return () => clearTimeout(timer);
    }
  }, [phase, onDealerPlay, PHASES]);

  // Auto-advance if player has blackjack
  useEffect(() => {
    if (phase === PHASES.PLAYER_TURN && playerHands.length === 1 && isBlackjack(playerHands[0].cards)) {
      const timer = setTimeout(onStand, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, playerHands, onStand, PHASES]);

  const activeHand = playerHands[activeHandIndex];
  const canHit = phase === PHASES.PLAYER_TURN && activeHand && !isBust(activeHand.cards) && handTotal(activeHand.cards) < 21;
  const canDbl = canHit && canDoubleDown(activeHand.cards);
  const canSpl = canHit && canSplit(activeHand.cards);
  const canStnd = phase === PHASES.PLAYER_TURN && activeHand && !isBust(activeHand.cards);
  const progress = shoeProgress(shoeSize);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-felt-dark to-felt relative overflow-hidden">
      {/* Top bar */}
      <div className="flex justify-between items-center px-3 pt-2 pb-1">
        <button
          onClick={onToggleCount}
          className="text-xs px-3 py-1.5 rounded-full bg-black/30 text-gray-300 active:bg-black/50"
        >
          {showCount ? 'Hide Count' : 'Show Count'}
        </button>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-400">{progress}%</div>
          <div className="w-16 h-1.5 bg-black/30 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Count display */}
      {showCount && (
        <CountDisplay runningCount={runningCount} trueCount={trueCount} />
      )}

      {/* Dealer area */}
      <div className="flex-shrink-0 flex justify-center pt-2 pb-3">
        {dealerHand.length > 0 && (
          <Hand cards={dealerHand} hidden={dealerHidden} label="Dealer" />
        )}
      </div>

      {/* Other players (compact) */}
      {otherPlayers.length > 0 && (
        <div className="flex justify-center gap-3 px-2 pb-2 overflow-x-auto">
          {otherPlayers.map((hand, i) => (
            <div key={i} className="opacity-60 flex-shrink-0">
              <Hand cards={hand} label={`P${i + 1}`} small />
            </div>
          ))}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Message */}
      {message && (
        <div className="text-center py-2">
          <span className="text-yellow-400 font-bold text-lg animate-pulse">{message}</span>
        </div>
      )}

      {/* Insurance prompt */}
      {insuranceOffered && phase === PHASES.PLAYER_TURN && (
        <div className="flex justify-center gap-3 py-2">
          <button
            onClick={() => onInsurance(true)}
            className="px-6 py-3 bg-yellow-600 text-white font-bold rounded-xl active:scale-95"
          >
            Take Insurance
          </button>
          <button
            onClick={onDeclineInsurance}
            className="px-6 py-3 bg-slate-700 text-white font-bold rounded-xl active:scale-95"
          >
            No Thanks
          </button>
        </div>
      )}

      {/* Player hands */}
      <div className="flex-shrink-0 flex justify-center gap-4 px-2 pb-2">
        {playerHands.map((hand, i) => (
          <div key={i} className={`${i === activeHandIndex && phase === PHASES.PLAYER_TURN ? 'pulse-glow rounded-xl p-1' : 'p-1'}`}>
            <Hand
              cards={hand.cards}
              label={playerHands.length > 1 ? `Hand ${i + 1} ($${hand.bet})` : `Your Hand ($${hand.bet})`}
              active={i === activeHandIndex && phase === PHASES.PLAYER_TURN}
            />
          </div>
        ))}
      </div>

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
        <div className="text-center py-4 text-gray-300 animate-pulse">
          Dealer playing...
        </div>
      )}
    </div>
  );
}
