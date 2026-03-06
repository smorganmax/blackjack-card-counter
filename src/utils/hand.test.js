import { describe, it, expect } from 'vitest';
import { handTotal, isBlackjack, isBust, canSplit, canDoubleDown, handResult, isSoft } from './hand';

const card = (rank, suit = '♠') => ({ rank, suit });

describe('hand', () => {
  describe('handTotal', () => {
    it('calculates simple totals', () => {
      expect(handTotal([card('5'), card('3')])).toBe(8);
      expect(handTotal([card('K'), card('7')])).toBe(17);
    });

    it('counts aces as 11 when possible', () => {
      expect(handTotal([card('A'), card('9')])).toBe(20);
    });

    it('counts aces as 1 to avoid bust', () => {
      expect(handTotal([card('A'), card('K'), card('5')])).toBe(16);
    });

    it('handles multiple aces', () => {
      expect(handTotal([card('A'), card('A')])).toBe(12);
      expect(handTotal([card('A'), card('A'), card('9')])).toBe(21);
    });
  });

  describe('isBlackjack', () => {
    it('returns true for natural 21', () => {
      expect(isBlackjack([card('A'), card('K')])).toBe(true);
      expect(isBlackjack([card('10'), card('A')])).toBe(true);
    });

    it('returns false for non-blackjack 21', () => {
      expect(isBlackjack([card('7'), card('7'), card('7')])).toBe(false);
    });

    it('returns false for non-21 two card hand', () => {
      expect(isBlackjack([card('K'), card('9')])).toBe(false);
    });
  });

  describe('isBust', () => {
    it('returns true when total exceeds 21', () => {
      expect(isBust([card('K'), card('Q'), card('5')])).toBe(true);
    });

    it('returns false when at 21 or under', () => {
      expect(isBust([card('K'), card('Q')])).toBe(false);
    });
  });

  describe('isSoft', () => {
    it('returns true for soft hands', () => {
      expect(isSoft([card('A'), card('6')])).toBe(true);
    });

    it('returns false for hard hands', () => {
      expect(isSoft([card('K'), card('7')])).toBe(false);
      expect(isSoft([card('A'), card('K'), card('5')])).toBe(false);
    });
  });

  describe('canSplit', () => {
    it('returns true for pairs', () => {
      expect(canSplit([card('8'), card('8')])).toBe(true);
      expect(canSplit([card('K'), card('Q')])).toBe(true); // same value
    });

    it('returns false for non-pairs', () => {
      expect(canSplit([card('8'), card('9')])).toBe(false);
      expect(canSplit([card('8'), card('8'), card('2')])).toBe(false);
    });
  });

  describe('canDoubleDown', () => {
    it('returns true with exactly 2 cards', () => {
      expect(canDoubleDown([card('5'), card('6')])).toBe(true);
    });

    it('returns false with more than 2 cards', () => {
      expect(canDoubleDown([card('5'), card('3'), card('2')])).toBe(false);
    });
  });

  describe('handResult', () => {
    it('player blackjack beats dealer non-blackjack', () => {
      expect(handResult([card('A'), card('K')], [card('10'), card('9')])).toBe('blackjack');
    });

    it('both blackjack is push', () => {
      expect(handResult([card('A'), card('K')], [card('A'), card('Q')])).toBe('push');
    });

    it('player bust loses', () => {
      expect(handResult([card('K'), card('Q'), card('5')], [card('10'), card('7')])).toBe('bust');
    });

    it('dealer bust means player wins', () => {
      expect(handResult([card('10'), card('7')], [card('K'), card('Q'), card('5')])).toBe('win');
    });

    it('higher total wins', () => {
      expect(handResult([card('10'), card('9')], [card('10'), card('8')])).toBe('win');
      expect(handResult([card('10'), card('7')], [card('10'), card('9')])).toBe('lose');
    });

    it('equal totals push', () => {
      expect(handResult([card('10'), card('7')], [card('K'), card('7')])).toBe('push');
    });
  });
});
