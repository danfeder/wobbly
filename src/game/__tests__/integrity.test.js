// src/game/__tests__/integrity.test.js
import { describe, it, expect } from 'vitest';
import { getIntegrityTier } from '../stress-test.js';

describe('integrity tier', () => {
  it('returns Rock Solid for high scores', () => {
    expect(getIntegrityTier(90)).toBe('Rock Solid');
    expect(getIntegrityTier(100)).toBe('Rock Solid');
  });

  it('returns Holding Together for medium scores', () => {
    expect(getIntegrityTier(50)).toBe('Holding Together');
    expect(getIntegrityTier(69)).toBe('Holding Together');
  });

  it('returns Barely Standing for low scores', () => {
    expect(getIntegrityTier(0)).toBe('Barely Standing');
    expect(getIntegrityTier(30)).toBe('Barely Standing');
  });
});
