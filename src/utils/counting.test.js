import { describe, it, expect } from 'vitest';
import { hiLoValue, runningCount, trueCount, decksRemaining, suggestedBet } from './counting';

const card = (rank, suit = '♠') => ({ rank, suit });

describe('counting', () => {
  describe('hiLoValue', () => {
    it('assigns +1 to low cards (2-6)', () => {
      expect(hiLoValue(card('2'))).toBe(1);
      expect(hiLoValue(card('3'))).toBe(1);
      expect(hiLoValue(card('4'))).toBe(1);
      expect(hiLoValue(card('5'))).toBe(1);
      expect(hiLoValue(card('6'))).toBe(1);
    });

    it('assigns 0 to neutral cards (7-9)', () => {
      expect(hiLoValue(card('7'))).toBe(0);
      expect(hiLoValue(card('8'))).toBe(0);
      expect(hiLoValue(card('9'))).toBe(0);
    });

    it('assigns -1 to high cards (10-A)', () => {
      expect(hiLoValue(card('10'))).toBe(-1);
      expect(hiLoValue(card('J'))).toBe(-1);
      expect(hiLoValue(card('Q'))).toBe(-1);
      expect(hiLoValue(card('K'))).toBe(-1);
      expect(hiLoValue(card('A'))).toBe(-1);
    });
  });

  describe('runningCount', () => {
    it('calculates running count for dealt cards', () => {
      const cards = [card('2'), card('K'), card('5'), card('A')];
      // +1 -1 +1 -1 = 0
      expect(runningCount(cards)).toBe(0);
    });

    it('returns 0 for no cards', () => {
      expect(runningCount([])).toBe(0);
    });

    it('handles all low cards', () => {
      const cards = [card('2'), card('3'), card('4'), card('5'), card('6')];
      expect(runningCount(cards)).toBe(5);
    });

    it('handles all high cards', () => {
      const cards = [card('10'), card('J'), card('Q'), card('K'), card('A')];
      expect(runningCount(cards)).toBe(-5);
    });
  });

  describe('decksRemaining', () => {
    it('calculates decks from shoe size', () => {
      expect(decksRemaining(104)).toBe(2);
      expect(decksRemaining(52)).toBe(1);
    });

    it('returns minimum of 0.5', () => {
      expect(decksRemaining(10)).toBe(10 / 52);
      expect(decksRemaining(0)).toBe(0.5);
    });
  });

  describe('trueCount', () => {
    it('divides running count by decks remaining', () => {
      expect(trueCount(4, 52)).toBe(4); // 4 / 1 deck
      expect(trueCount(4, 104)).toBe(2); // 4 / 2 decks
    });
  });

  describe('suggestedBet', () => {
    it('returns base bet for low/negative counts', () => {
      expect(suggestedBet(0)).toBe(10);
      expect(suggestedBet(-3)).toBe(10);
      expect(suggestedBet(1)).toBe(10);
    });

    it('increases bet with higher true count', () => {
      expect(suggestedBet(2)).toBe(20);
      expect(suggestedBet(3)).toBe(40);
      expect(suggestedBet(4)).toBe(80);
      expect(suggestedBet(5)).toBe(100);
    });
  });
});
