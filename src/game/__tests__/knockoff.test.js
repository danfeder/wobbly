// src/game/__tests__/knockoff.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { getState, resetState, addLandedBall, getLandedBalls, setRoundOver } from '../state.js';

describe('landed ball tracking', () => {
  beforeEach(() => {
    resetState();
  });

  it('starts with no landed balls', () => {
    expect(getLandedBalls()).toEqual([]);
  });

  it('addLandedBall stores a ball reference', () => {
    const fakeBall = { id: 1 };
    addLandedBall(fakeBall);
    expect(getLandedBalls()).toEqual([fakeBall]);
  });

  it('tracks multiple landed balls', () => {
    const ball1 = { id: 1 };
    const ball2 = { id: 2 };
    addLandedBall(ball1);
    addLandedBall(ball2);
    expect(getLandedBalls()).toHaveLength(2);
  });

  it('resetState clears landed balls', () => {
    addLandedBall({ id: 1 });
    resetState();
    expect(getLandedBalls()).toEqual([]);
  });
});
