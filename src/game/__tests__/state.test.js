// src/game/__tests__/state.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { getState, setState, advanceShot, setRoundOver, resetState, STATES } from '../state.js';

describe('state', () => {
  beforeEach(() => {
    resetState();
  });

  it('starts in AIMING with shot 1', () => {
    const s = getState();
    expect(s.current).toBe(STATES.AIMING);
    expect(s.shotNumber).toBe(1);
    expect(s.result).toBeNull();
  });

  it('advanceShot increments shot and returns to AIMING', () => {
    advanceShot();
    const s = getState();
    expect(s.shotNumber).toBe(2);
    expect(s.current).toBe(STATES.AIMING);
  });

  it('advanceShot past MAX_SHOTS triggers WIN', () => {
    for (let i = 0; i < 5; i++) advanceShot();
    const s = getState();
    expect(s.current).toBe(STATES.WIN);
    expect(s.result).toBe('win');
  });

  it('setRoundOver sets ROUND_OVER with reason', () => {
    setRoundOver('topple');
    const s = getState();
    expect(s.current).toBe(STATES.ROUND_OVER);
    expect(s.result).toBe('topple');
  });

  it('resetState returns to initial state', () => {
    advanceShot();
    advanceShot();
    setRoundOver('miss');
    resetState();
    const s = getState();
    expect(s.current).toBe(STATES.AIMING);
    expect(s.shotNumber).toBe(1);
    expect(s.result).toBeNull();
  });
});
