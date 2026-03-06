import React from 'react';
import useGame from './hooks/useGame';
import SetupScreen from './components/SetupScreen';
import BettingScreen from './components/BettingScreen';
import GameTable from './components/GameTable';
import CountQuiz from './components/CountQuiz';
import RoundResult from './components/RoundResult';

export default function App() {
  const { state, actions, trueCount: tc, PHASES } = useGame();

  switch (state.phase) {
    case PHASES.SETUP:
      return (
        <SetupScreen
          numPlayers={state.numPlayers}
          onSetPlayers={actions.setPlayers}
          onStart={actions.startGame}
        />
      );

    case PHASES.BETTING:
      return (
        <BettingScreen
          currentBet={state.currentBet}
          chips={state.stats.chips}
          shoeSize={state.shoe.length}
          onSetBet={actions.setBet}
          onDeal={actions.deal}
          message={state.message}
        />
      );

    case PHASES.PLAYER_TURN:
    case PHASES.DEALER_TURN:
    case PHASES.DEALING:
      return (
        <GameTable
          dealerHand={state.dealerHand}
          dealerHidden={state.dealerHidden}
          playerHands={state.playerHands}
          otherPlayers={state.otherPlayers}
          activeHandIndex={state.activeHandIndex}
          phase={state.phase}
          showCount={state.showCount}
          runningCount={state.runningCount}
          trueCount={tc}
          shoeSize={state.shoe.length}
          message={state.message}
          insuranceOffered={state.insuranceOffered}
          onHit={actions.hit}
          onStand={actions.stand}
          onDouble={actions.double}
          onSplit={actions.split}
          onInsurance={actions.insurance}
          onDeclineInsurance={actions.declineInsurance}
          onDealerPlay={actions.dealerPlay}
          onToggleCount={actions.toggleCount}
          PHASES={PHASES}
        />
      );

    case PHASES.COUNT_QUIZ:
      return (
        <CountQuiz
          dealerHand={state.dealerHand}
          playerHands={state.playerHands}
          runningCount={state.runningCount}
          trueCount={tc}
          roundResults={state.roundResults}
          onSubmit={actions.submitCountGuess}
          onSkip={actions.skipQuiz}
        />
      );

    case PHASES.ROUND_RESULT:
      return (
        <RoundResult
          dealerHand={state.dealerHand}
          playerHands={state.playerHands}
          roundResults={state.roundResults}
          runningCount={state.runningCount}
          trueCount={tc}
          quizAnswer={state.quizAnswer}
          quizSubmitted={state.quizSubmitted}
          stats={state.stats}
          onNextRound={actions.nextRound}
          onBackToSetup={actions.backToSetup}
        />
      );

    default:
      return <div className="text-white p-4">Unknown phase: {state.phase}</div>;
  }
}
