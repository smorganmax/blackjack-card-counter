import React, { useState } from 'react';
import useGame from './hooks/useGame';
import MainMenu from './components/MainMenu';
import SetupScreen from './components/SetupScreen';
import BettingScreen from './components/BettingScreen';
import GameTable from './components/GameTable';
import CountQuiz from './components/CountQuiz';
import RoundResult from './components/RoundResult';
import SpeedDrill from './components/SpeedDrill';
import StatsDashboard from './components/StatsDashboard';
import SettingsScreen from './components/SettingsScreen';
import DistractionOverlay from './components/DistractionOverlay';

export default function App() {
  const { state, actions, trueCount: tc, PHASES } = useGame();
  const [screen, setScreen] = useState('menu');

  const handleNavigate = (target) => {
    if (target === 'play' || target === 'countQuiz') {
      setScreen('play');
    } else {
      setScreen(target);
    }
  };

  const handleBackToMenu = () => {
    actions.backToSetup();
    setScreen('menu');
  };

  // Non-game screens
  if (screen === 'menu' && state.phase === PHASES.SETUP) {
    return <MainMenu onNavigate={handleNavigate} />;
  }

  if (screen === 'speedDrill') {
    return <SpeedDrill onBack={() => setScreen('menu')} />;
  }

  if (screen === 'stats') {
    return <StatsDashboard onBack={() => setScreen('menu')} />;
  }

  if (screen === 'settings') {
    return (
      <SettingsScreen
        settings={state.settings}
        onUpdateSettings={actions.updateSettings}
        onBack={() => setScreen('menu')}
      />
    );
  }

  // Game screens
  switch (state.phase) {
    case PHASES.SETUP:
      return (
        <SetupScreen
          numPlayers={state.numPlayers}
          onSetPlayers={actions.setPlayers}
          onStart={actions.startGame}
          onBack={() => setScreen('menu')}
        />
      );

    case PHASES.BETTING:
      return (
        <BettingScreen
          currentBet={state.currentBet}
          chips={state.stats.chips}
          shoeSize={state.shoe.length}
          trueCount={tc}
          settings={state.settings}
          onSetBet={actions.setBet}
          onDeal={actions.deal}
          onBack={handleBackToMenu}
          message={state.message}
        />
      );

    case PHASES.PLAYER_TURN:
    case PHASES.DEALER_TURN:
    case PHASES.DEALING:
      return (
        <>
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
            settings={state.settings}
            strategyFeedback={state.strategyFeedback}
            deviationFeedback={state.deviationFeedback}
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
          <DistractionOverlay enabled={state.settings?.casinoDistractions && state.phase === PHASES.PLAYER_TURN} />
        </>
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
          onBackToSetup={handleBackToMenu}
        />
      );

    default:
      return <div className="text-white p-4">Unknown phase: {state.phase}</div>;
  }
}
