import { describe, it, expect } from 'vitest';
import { createShoe, shuffle, shouldReshuffle, cardValue, TOTAL_CARDS, NUM_DECKS } from './deck';

describe('deck', () => {
  it('creates a shoe with correct number of cards', () => {
    const shoe = createShoe();
    expect(shoe.length).toBe(TOTAL_CARDS);
  });

  it('uses 2 decks by default', () => {
    expect(NUM_DECKS).toBe(2);
    expect(TOTAL_CARDS).toBe(104);
  });

  it('has correct distribution of cards', () => {
    const shoe = createShoe();
    const aces = shoe.filter(c => c.rank === 'A');
    expect(aces.length).toBe(8); // 4 per deck * 2 decks
    const kings = shoe.filter(c => c.rank === 'K');
    expect(kings.length).toBe(8);
  });

  it('shuffles cards', () => {
    const shoe1 = createShoe();
    const shoe2 = createShoe();
    // Extremely unlikely to be identical after shuffle
    const labels1 = shoe1.map(c => c.rank + c.suit).join('');
    const labels2 = shoe2.map(c => c.rank + c.suit).join('');
    expect(labels1).not.toBe(labels2);
  });

  it('shouldReshuffle returns true when shoe is depleted past penetration', () => {
    const smallShoe = new Array(20).fill({ rank: '2', suit: '♠' });
    expect(shouldReshuffle(smallShoe)).toBe(true);
    const largeShoe = new Array(80).fill({ rank: '2', suit: '♠' });
    expect(shouldReshuffle(largeShoe)).toBe(false);
  });

  it('cardValue returns correct values', () => {
    expect(cardValue({ rank: 'A', suit: '♠' })).toBe(11);
    expect(cardValue({ rank: 'K', suit: '♠' })).toBe(10);
    expect(cardValue({ rank: 'Q', suit: '♠' })).toBe(10);
    expect(cardValue({ rank: 'J', suit: '♠' })).toBe(10);
    expect(cardValue({ rank: '10', suit: '♠' })).toBe(10);
    expect(cardValue({ rank: '5', suit: '♠' })).toBe(5);
    expect(cardValue({ rank: '2', suit: '♠' })).toBe(2);
  });
});
