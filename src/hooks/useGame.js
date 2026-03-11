import { useReducer, useCallback } from 'react';
import { createShoe, TOTAL_CARDS } from '../utils/deck';
import { handTotal, isBlackjack, isBust, canSplit, canDoubleDown, handResult, isSoft } from '../utils/hand';
import { runningCount, trueCount, hiLoValue } from '../utils/counting';
import { loadStats, saveStats, defaultStats, loadSettings, saveSettings } from '../utils/storage';
import { checkStrategy } from '../utils/strategy';
import { checkDeviationPlay } from '../utils/deviations';
import { isBetOptimal } from '../components/BetCoachIndicator';

const PHASES = {
  SETUP: 'setup',
  BETTING: 'betting',
  DEALING: 'dealing',
  PLAYER_TURN: 'playerTurn',
  DEALER_TURN: 'dealerTurn',
  RESOLUTION: 'resolution',
  COUNT_QUIZ: 'countQuiz',
  ROUND_RESULT: 'roundResult'
};

function customShouldReshuffle(shoe, penetrationPercent = 75) {
  return shoe.length <= TOTAL_CARDS * (1 - penetrationPercent / 100);
}

function initialState() {
  const settings = loadSettings();
  return {
    phase: PHASES.SETUP,
    numPlayers: 1,
    shoe: [],
    dealtCards: [],
    runningCount: 0,
    dealerHand: [],
    dealerHidden: true,
    playerHands: [],
    otherPlayers: [],
    activeHandIndex: 0,
    currentBet: 10,
    stats: loadStats(),
    settings,
    showCount: settings.showCount,
    roundResults: [],
    quizAnswer: null,
    quizSubmitted: false,
    insurance: false,
    insuranceOffered: false,
    message: '',
    strategyFeedback: null,
    deviationFeedback: null,
    handsSinceQuiz: 0,
    countQuizMode: false,
  };
}

function dealCard(state) {
  if (state.shoe.length === 0) return { card: null, shoe: state.shoe, dealtCards: state.dealtCards };
  const shoe = [...state.shoe];
  const card = shoe.pop();
  const dealtCards = [...state.dealtCards, card];
  return { card, shoe, dealtCards };
}

function dealMultiple(shoe, dealtCards, count) {
  const cards = [];
  let s = [...shoe];
  let d = [...dealtCards];
  for (let i = 0; i < count; i++) {
    if (s.length === 0) break;
    const card = s.pop();
    cards.push(card);
    d.push(card);
  }
  return { cards, shoe: s, dealtCards: d };
}

function generateOtherPlayerActions(hands, shoe, dealtCards) {
  let s = [...shoe];
  let d = [...dealtCards];
  const updatedHands = hands.map(hand => {
    const cards = [...hand];
    // Simple AI: hit on 16 or less, stand on 17+
    while (handTotal(cards) < 17 && s.length > 0) {
      const card = s.pop();
      cards.push(card);
      d.push(card);
    }
    return cards;
  });
  return { hands: updatedHands, shoe: s, dealtCards: d };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PLAYERS': {
      return { ...state, numPlayers: action.count };
    }

    case 'START_GAME': {
      const shoe = createShoe();
      return {
        ...state,
        phase: PHASES.BETTING,
        shoe,
        dealtCards: [],
        runningCount: 0,
        dealerHand: [],
        dealerHidden: true,
        playerHands: [],
        otherPlayers: [],
        activeHandIndex: 0,
        roundResults: [],
        quizAnswer: null,
        quizSubmitted: false,
        insurance: false,
        insuranceOffered: false,
        message: ''
      };
    }

    case 'SET_BET': {
      return { ...state, currentBet: action.amount };
    }

    case 'DEAL': {
      let shoe = [...state.shoe];
      let dealtCards = [...state.dealtCards];
      const pen = state.settings?.penetrationPercent || 75;

      if (customShouldReshuffle(shoe, pen)) {
        shoe = createShoe();
        dealtCards = [];
      }

      // Deal to other players first (2 cards each)
      const otherPlayers = [];
      for (let i = 0; i < state.numPlayers - 1; i++) {
        const result = dealMultiple(shoe, dealtCards, 2);
        otherPlayers.push(result.cards);
        shoe = result.shoe;
        dealtCards = result.dealtCards;
      }

      // Deal player cards
      const p1 = dealMultiple(shoe, dealtCards, 2);
      shoe = p1.shoe;
      dealtCards = p1.dealtCards;

      // Deal dealer cards
      const d1 = dealMultiple(shoe, dealtCards, 2);
      shoe = d1.shoe;
      dealtCards = d1.dealtCards;

      const rc = runningCount(dealtCards);
      const dealerShowsAce = d1.cards[0].rank === 'A';

      // Track bet spread stats
      const tc = trueCount(rc, shoe.length);
      const stats = { ...state.stats };
      const betOpt = isBetOptimal(state.currentBet, tc);
      stats.betTotal = (stats.betTotal || 0) + 1;
      if (betOpt) stats.betCorrect = (stats.betCorrect || 0) + 1;
      if (state.currentBet >= 40) {
        stats.bigBetTcSum = (stats.bigBetTcSum || 0) + tc;
        stats.bigBetCount = (stats.bigBetCount || 0) + 1;
      } else {
        stats.smallBetTcSum = (stats.smallBetTcSum || 0) + tc;
        stats.smallBetCount = (stats.smallBetCount || 0) + 1;
      }

      // Check for dealer blackjack with ace showing
      const nextPhase = dealerShowsAce ? PHASES.PLAYER_TURN :
        isBlackjack(p1.cards) ? PHASES.DEALER_TURN : PHASES.PLAYER_TURN;

      return {
        ...state,
        phase: nextPhase,
        shoe,
        dealtCards,
        runningCount: rc,
        dealerHand: d1.cards,
        dealerHidden: true,
        playerHands: [{ cards: p1.cards, bet: state.currentBet, doubled: false, splitFrom: null }],
        otherPlayers,
        activeHandIndex: 0,
        insuranceOffered: dealerShowsAce,
        insurance: false,
        message: dealerShowsAce ? 'Insurance?' : (isBlackjack(p1.cards) ? 'Blackjack!' : ''),
        strategyFeedback: null,
        deviationFeedback: null,
        stats,
      };
    }

    case 'INSURANCE': {
      return { ...state, insurance: action.take, insuranceOffered: false, message: '' };
    }

    case 'DECLINE_INSURANCE': {
      const playerBJ = isBlackjack(state.playerHands[0].cards);
      return {
        ...state,
        insuranceOffered: false,
        insurance: false,
        phase: playerBJ ? PHASES.DEALER_TURN : PHASES.PLAYER_TURN,
        message: playerBJ ? 'Blackjack!' : ''
      };
    }

    case 'HIT': {
      // Check strategy BEFORE the hit (using current hand)
      const preHitHand = state.playerHands[state.activeHandIndex];
      const dealerUp = state.dealerHand[0];
      const stratCheck = checkStrategy('hit', preHitHand.cards, dealerUp);
      const tc_h = trueCount(state.runningCount, state.shoe.length);
      const devCheck = checkDeviationPlay('hit', preHitHand.cards, dealerUp, tc_h);

      const { card, shoe, dealtCards } = dealCard(state);
      if (!card) return state;

      const hands = [...state.playerHands];
      const hand = { ...hands[state.activeHandIndex] };
      hand.cards = [...hand.cards, card];
      hands[state.activeHandIndex] = hand;

      const rc = runningCount(dealtCards);
      const bust = isBust(hand.cards);

      let nextPhase = state.phase;
      let activeIndex = state.activeHandIndex;
      let message = '';

      if (bust) {
        message = 'Bust!';
        if (activeIndex < hands.length - 1) {
          activeIndex++;
        } else {
          nextPhase = PHASES.DEALER_TURN;
        }
      }

      if (!bust && handTotal(hand.cards) === 21) {
        if (activeIndex < hands.length - 1) {
          activeIndex++;
        } else {
          nextPhase = PHASES.DEALER_TURN;
        }
      }

      // Update strategy stats
      const stats = updateStrategyStats(state.stats, stratCheck, devCheck);

      return {
        ...state,
        shoe,
        dealtCards,
        runningCount: rc,
        playerHands: hands,
        activeHandIndex: activeIndex,
        phase: nextPhase,
        message,
        strategyFeedback: stratCheck,
        deviationFeedback: devCheck,
        stats,
      };
    }

    case 'STAND': {
      const preStandHand = state.playerHands[state.activeHandIndex];
      const dealerUp_s = state.dealerHand[0];
      const stratCheck_s = checkStrategy('stand', preStandHand.cards, dealerUp_s);
      const tc_s = trueCount(state.runningCount, state.shoe.length);
      const devCheck_s = checkDeviationPlay('stand', preStandHand.cards, dealerUp_s, tc_s);

      const stats_s = updateStrategyStats(state.stats, stratCheck_s, devCheck_s);

      let activeIndex = state.activeHandIndex;
      if (activeIndex < state.playerHands.length - 1) {
        return { ...state, activeHandIndex: activeIndex + 1, strategyFeedback: stratCheck_s, deviationFeedback: devCheck_s, stats: stats_s };
      }
      return { ...state, phase: PHASES.DEALER_TURN, strategyFeedback: stratCheck_s, deviationFeedback: devCheck_s, stats: stats_s };
    }

    case 'DOUBLE': {
      const preDoubleHand = state.playerHands[state.activeHandIndex];
      const dealerUp_d = state.dealerHand[0];
      const stratCheck_d = checkStrategy('double', preDoubleHand.cards, dealerUp_d);
      const tc_d = trueCount(state.runningCount, state.shoe.length);
      const devCheck_d = checkDeviationPlay('double', preDoubleHand.cards, dealerUp_d, tc_d);

      const { card, shoe, dealtCards } = dealCard(state);
      if (!card) return state;

      const hands = [...state.playerHands];
      const hand = { ...hands[state.activeHandIndex] };
      hand.cards = [...hand.cards, card];
      hand.bet = hand.bet * 2;
      hand.doubled = true;
      hands[state.activeHandIndex] = hand;

      const rc = runningCount(dealtCards);
      let activeIndex = state.activeHandIndex;
      if (activeIndex < hands.length - 1) {
        activeIndex++;
      }

      const stats_d = updateStrategyStats(state.stats, stratCheck_d, devCheck_d);

      return {
        ...state,
        shoe,
        dealtCards,
        runningCount: rc,
        playerHands: hands,
        activeHandIndex: activeIndex,
        phase: activeIndex === state.activeHandIndex ? PHASES.DEALER_TURN : state.phase,
        message: isBust(hand.cards) ? 'Bust!' : '',
        strategyFeedback: stratCheck_d,
        deviationFeedback: devCheck_d,
        stats: stats_d,
      };
    }

    case 'SPLIT': {
      const hands = [...state.playerHands];
      const hand = hands[state.activeHandIndex];
      if (!canSplit(hand.cards)) return state;

      const dealerUp_sp = state.dealerHand[0];
      const stratCheck_sp = checkStrategy('split', hand.cards, dealerUp_sp);
      const tc_sp = trueCount(state.runningCount, state.shoe.length);
      const devCheck_sp = checkDeviationPlay('split', hand.cards, dealerUp_sp, tc_sp);

      let shoe = [...state.shoe];
      let dealtCards = [...state.dealtCards];

      const card1 = hand.cards[0];
      const card2 = hand.cards[1];

      const r1 = dealMultiple(shoe, dealtCards, 1);
      shoe = r1.shoe;
      dealtCards = r1.dealtCards;

      const r2 = dealMultiple(shoe, dealtCards, 1);
      shoe = r2.shoe;
      dealtCards = r2.dealtCards;

      const hand1 = { cards: [card1, ...r1.cards], bet: hand.bet, doubled: false, splitFrom: card1.rank };
      const hand2 = { cards: [card2, ...r2.cards], bet: hand.bet, doubled: false, splitFrom: card2.rank };

      hands.splice(state.activeHandIndex, 1, hand1, hand2);

      const stats_sp = updateStrategyStats(state.stats, stratCheck_sp, devCheck_sp);

      return {
        ...state,
        shoe,
        dealtCards,
        runningCount: runningCount(dealtCards),
        playerHands: hands,
        message: 'Hand split!',
        strategyFeedback: stratCheck_sp,
        deviationFeedback: devCheck_sp,
        stats: stats_sp,
      };
    }

    case 'DEALER_PLAY': {
      let shoe = [...state.shoe];
      let dealtCards = [...state.dealtCards];
      let dealerHand = [...state.dealerHand];

      // Play other players first
      const otherResult = generateOtherPlayerActions(state.otherPlayers, shoe, dealtCards);
      shoe = otherResult.shoe;
      dealtCards = otherResult.dealtCards;

      // Dealer plays: hit on soft 17 (H17 rules)
      let dealerTotal = handTotal(dealerHand);
      while ((dealerTotal < 17 || (dealerTotal === 17 && isSoft(dealerHand))) && shoe.length > 0) {
        const card = shoe.pop();
        dealerHand.push(card);
        dealtCards.push(card);
        dealerTotal = handTotal(dealerHand);
      }

      const rc = runningCount(dealtCards);
      const tc_dp = trueCount(rc, shoe.length);

      // Calculate results for each player hand
      const roundResults = state.playerHands.map(hand => {
        const result = handResult(hand.cards, dealerHand);
        let payout = 0;
        if (result === 'blackjack') payout = Math.floor(hand.bet * 1.5);
        else if (result === 'win') payout = hand.bet;
        else if (result === 'lose' || result === 'bust') payout = -hand.bet;
        return { result, payout, bet: hand.bet };
      });

      // Insurance payout
      let insurancePayout = 0;
      if (state.insurance) {
        const insuranceBet = Math.floor(state.currentBet / 2);
        if (isBlackjack(dealerHand)) {
          insurancePayout = insuranceBet * 2;
        } else {
          insurancePayout = -insuranceBet;
        }
      }

      const totalPayout = roundResults.reduce((sum, r) => sum + r.payout, 0) + insurancePayout;

      const stats = { ...state.stats };
      stats.handsPlayed += state.playerHands.length;
      stats.chips += totalPayout;

      // Track wins by count
      for (const r of roundResults) {
        if (tc_dp > 0) {
          stats.handsAtPositive = (stats.handsAtPositive || 0) + 1;
          if (r.result === 'win' || r.result === 'blackjack') stats.winsAtPositive = (stats.winsAtPositive || 0) + 1;
        } else {
          stats.handsAtNegative = (stats.handsAtNegative || 0) + 1;
          if (r.result === 'win' || r.result === 'blackjack') stats.winsAtNegative = (stats.winsAtNegative || 0) + 1;
        }

        if (r.result === 'win') stats.wins++;
        else if (r.result === 'blackjack') { stats.wins++; stats.blackjacks++; }
        else if (r.result === 'lose') stats.losses++;
        else if (r.result === 'bust') { stats.losses++; stats.busts++; }
        else if (r.result === 'push') stats.pushes++;
      }

      const newHandsSinceQuiz = (state.handsSinceQuiz || 0) + 1;
      const quizInterval = state.settings?.countQuizInterval || 1;
      const shouldShowQuiz = newHandsSinceQuiz >= quizInterval;

      return {
        ...state,
        shoe,
        dealtCards,
        runningCount: rc,
        dealerHand,
        dealerHidden: false,
        otherPlayers: otherResult.hands,
        roundResults,
        stats,
        phase: shouldShowQuiz ? PHASES.COUNT_QUIZ : PHASES.ROUND_RESULT,
        message: '',
        handsSinceQuiz: shouldShowQuiz ? 0 : newHandsSinceQuiz,
      };
    }

    case 'SUBMIT_COUNT_GUESS': {
      const guess = parseInt(action.guess, 10);
      const correct = guess === state.runningCount;
      const stats = { ...state.stats };
      stats.countGuesses++;
      if (correct) stats.countCorrect++;

      // Track distraction accuracy
      if (state.settings?.casinoDistractions) {
        stats.distractionCountTotal = (stats.distractionCountTotal || 0) + 1;
        if (correct) stats.distractionCountCorrect = (stats.distractionCountCorrect || 0) + 1;
      } else {
        stats.normalCountTotal = (stats.normalCountTotal || 0) + 1;
        if (correct) stats.normalCountCorrect = (stats.normalCountCorrect || 0) + 1;
      }

      saveStats(stats);

      return {
        ...state,
        stats,
        quizAnswer: guess,
        quizSubmitted: true,
        phase: PHASES.ROUND_RESULT,
        handsSinceQuiz: 0,
      };
    }

    case 'SKIP_QUIZ': {
      saveStats(state.stats);
      return {
        ...state,
        quizSubmitted: true,
        handsSinceQuiz: 0,
        phase: PHASES.ROUND_RESULT
      };
    }

    case 'NEXT_ROUND': {
      const pen = state.settings?.penetrationPercent || 75;
      const needsShuffle = customShouldReshuffle(state.shoe, pen);
      return {
        ...state,
        phase: PHASES.BETTING,
        dealerHand: [],
        dealerHidden: true,
        playerHands: [],
        otherPlayers: [],
        activeHandIndex: 0,
        roundResults: [],
        quizAnswer: null,
        quizSubmitted: false,
        insurance: false,
        insuranceOffered: false,
        message: needsShuffle ? 'Shuffling new shoe...' : '',
        strategyFeedback: null,
        deviationFeedback: null,
      };
    }

    case 'TOGGLE_COUNT': {
      return { ...state, showCount: !state.showCount };
    }

    case 'UPDATE_SETTINGS': {
      const newSettings = action.settings;
      saveSettings(newSettings);
      return { ...state, settings: newSettings, showCount: newSettings.showCount };
    }

    case 'RESET_STATS': {
      const fresh = defaultStats();
      saveStats(fresh);
      return { ...state, stats: fresh };
    }

    case 'BACK_TO_SETUP': {
      return { ...initialState(), stats: state.stats, settings: state.settings };
    }

    default:
      return state;
  }
}

function updateStrategyStats(stats, stratCheck, devCheck) {
  const s = { ...stats };
  if (stratCheck) {
    s.strategyTotal = (s.strategyTotal || 0) + 1;
    if (stratCheck.correct) s.strategyCorrect = (s.strategyCorrect || 0) + 1;

    // By type
    const byType = { ...s.strategyByType } || { hard: { correct: 0, total: 0 }, soft: { correct: 0, total: 0 }, pair: { correct: 0, total: 0 } };
    const ht = stratCheck.handType || 'hard';
    if (byType[ht]) {
      byType[ht] = { ...byType[ht], total: byType[ht].total + 1 };
      if (stratCheck.correct) byType[ht] = { ...byType[ht], correct: byType[ht].correct + 1 };
    }
    s.strategyByType = byType;
  }
  if (devCheck && devCheck.isDeviation) {
    s.deviationTotal = (s.deviationTotal || 0) + 1;
    if (devCheck.correct) s.deviationCorrect = (s.deviationCorrect || 0) + 1;
  }
  return s;
}

export default function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const actions = {
    setPlayers: useCallback((count) => dispatch({ type: 'SET_PLAYERS', count }), []),
    startGame: useCallback(() => dispatch({ type: 'START_GAME' }), []),
    setBet: useCallback((amount) => dispatch({ type: 'SET_BET', amount }), []),
    deal: useCallback(() => dispatch({ type: 'DEAL' }), []),
    hit: useCallback(() => dispatch({ type: 'HIT' }), []),
    stand: useCallback(() => dispatch({ type: 'STAND' }), []),
    double: useCallback(() => dispatch({ type: 'DOUBLE' }), []),
    split: useCallback(() => dispatch({ type: 'SPLIT' }), []),
    insurance: useCallback((take) => dispatch({ type: 'INSURANCE', take }), []),
    declineInsurance: useCallback(() => dispatch({ type: 'DECLINE_INSURANCE' }), []),
    dealerPlay: useCallback(() => dispatch({ type: 'DEALER_PLAY' }), []),
    submitCountGuess: useCallback((guess) => dispatch({ type: 'SUBMIT_COUNT_GUESS', guess }), []),
    skipQuiz: useCallback(() => dispatch({ type: 'SKIP_QUIZ' }), []),
    nextRound: useCallback(() => dispatch({ type: 'NEXT_ROUND' }), []),
    toggleCount: useCallback(() => dispatch({ type: 'TOGGLE_COUNT' }), []),
    updateSettings: useCallback((settings) => dispatch({ type: 'UPDATE_SETTINGS', settings }), []),
    resetStats: useCallback(() => dispatch({ type: 'RESET_STATS' }), []),
    backToSetup: useCallback(() => dispatch({ type: 'BACK_TO_SETUP' }), [])
  };

  const tc = trueCount(state.runningCount, state.shoe.length);

  return { state, actions, trueCount: tc, PHASES };
}

export { PHASES };
