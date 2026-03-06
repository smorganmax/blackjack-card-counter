import { useReducer, useCallback } from 'react';
import { createShoe, shouldReshuffle, TOTAL_CARDS } from '../utils/deck';
import { handTotal, isBlackjack, isBust, canSplit, canDoubleDown, handResult } from '../utils/hand';
import { runningCount, trueCount, hiLoValue } from '../utils/counting';
import { loadStats, saveStats, defaultStats } from '../utils/storage';

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

function initialState() {
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
    showCount: false,
    roundResults: [],
    quizAnswer: null,
    quizSubmitted: false,
    insurance: false,
    insuranceOffered: false,
    message: ''
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

      if (shouldReshuffle(shoe)) {
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
        message: dealerShowsAce ? 'Insurance?' : (isBlackjack(p1.cards) ? 'Blackjack!' : '')
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

      return {
        ...state,
        shoe,
        dealtCards,
        runningCount: rc,
        playerHands: hands,
        activeHandIndex: activeIndex,
        phase: nextPhase,
        message
      };
    }

    case 'STAND': {
      let activeIndex = state.activeHandIndex;
      if (activeIndex < state.playerHands.length - 1) {
        return { ...state, activeHandIndex: activeIndex + 1 };
      }
      return { ...state, phase: PHASES.DEALER_TURN };
    }

    case 'DOUBLE': {
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

      return {
        ...state,
        shoe,
        dealtCards,
        runningCount: rc,
        playerHands: hands,
        activeHandIndex: activeIndex,
        phase: activeIndex === state.activeHandIndex ? PHASES.DEALER_TURN : state.phase,
        message: isBust(hand.cards) ? 'Bust!' : ''
      };
    }

    case 'SPLIT': {
      const hands = [...state.playerHands];
      const hand = hands[state.activeHandIndex];
      if (!canSplit(hand.cards)) return state;

      let shoe = [...state.shoe];
      let dealtCards = [...state.dealtCards];

      // Create two new hands from the split
      const card1 = hand.cards[0];
      const card2 = hand.cards[1];

      // Deal one card to each split hand
      const r1 = dealMultiple(shoe, dealtCards, 1);
      shoe = r1.shoe;
      dealtCards = r1.dealtCards;

      const r2 = dealMultiple(shoe, dealtCards, 1);
      shoe = r2.shoe;
      dealtCards = r2.dealtCards;

      const hand1 = { cards: [card1, ...r1.cards], bet: hand.bet, doubled: false, splitFrom: card1.rank };
      const hand2 = { cards: [card2, ...r2.cards], bet: hand.bet, doubled: false, splitFrom: card2.rank };

      hands.splice(state.activeHandIndex, 1, hand1, hand2);

      return {
        ...state,
        shoe,
        dealtCards,
        runningCount: runningCount(dealtCards),
        playerHands: hands,
        message: 'Hand split!'
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

      // Dealer plays: hit on 16 or less, stand on all 17s (including soft 17 per rules: stand on soft 17)
      while (handTotal(dealerHand) < 17 && shoe.length > 0) {
        const card = shoe.pop();
        dealerHand.push(card);
        dealtCards.push(card);
      }

      const rc = runningCount(dealtCards);

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
      for (const r of roundResults) {
        if (r.result === 'win') stats.wins++;
        else if (r.result === 'blackjack') { stats.wins++; stats.blackjacks++; }
        else if (r.result === 'lose') stats.losses++;
        else if (r.result === 'bust') { stats.losses++; stats.busts++; }
        else if (r.result === 'push') stats.pushes++;
      }

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
        phase: PHASES.COUNT_QUIZ,
        message: ''
      };
    }

    case 'SUBMIT_COUNT_GUESS': {
      const guess = parseInt(action.guess, 10);
      const correct = guess === state.runningCount;
      const stats = { ...state.stats };
      stats.countGuesses++;
      if (correct) stats.countCorrect++;
      saveStats(stats);

      return {
        ...state,
        stats,
        quizAnswer: guess,
        quizSubmitted: true,
        phase: PHASES.ROUND_RESULT
      };
    }

    case 'SKIP_QUIZ': {
      saveStats(state.stats);
      return {
        ...state,
        quizSubmitted: true,
        phase: PHASES.ROUND_RESULT
      };
    }

    case 'NEXT_ROUND': {
      const needsShuffle = shouldReshuffle(state.shoe);
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
        message: needsShuffle ? 'Shuffling new shoe...' : ''
      };
    }

    case 'TOGGLE_COUNT': {
      return { ...state, showCount: !state.showCount };
    }

    case 'RESET_STATS': {
      const fresh = defaultStats();
      saveStats(fresh);
      return { ...state, stats: fresh };
    }

    case 'BACK_TO_SETUP': {
      return { ...initialState(), stats: state.stats };
    }

    default:
      return state;
  }
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
    resetStats: useCallback(() => dispatch({ type: 'RESET_STATS' }), []),
    backToSetup: useCallback(() => dispatch({ type: 'BACK_TO_SETUP' }), [])
  };

  const tc = trueCount(state.runningCount, state.shoe.length);

  return { state, actions, trueCount: tc, PHASES };
}

export { PHASES };
