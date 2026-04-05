// src/game/__tests__/stress-test.test.js
import { describe, it, expect } from 'vitest';
import { runStressTest } from '../stress-test.js';

describe('stress test', () => {
  it('returns a score between 0 and 1', () => {
    // A simple two-block stack — should be fairly stable
    const bodies = [
      { type: 'block', x: 0, y: 0.5, angle: 0 },
      { type: 'block', x: 0, y: 1.5, angle: 0 },
    ];
    const result = runStressTest(bodies, { intensity: 'light' });
    expect(result.precariousness).toBeGreaterThanOrEqual(0);
    expect(result.precariousness).toBeLessThanOrEqual(1);
    expect(result.totalDisplacement).toBeGreaterThanOrEqual(0);
  });

  it('a tall narrow stack is more precarious than a flat one', () => {
    const stableStack = [
      { type: 'slab', x: 0, y: 0.2, angle: 0 },
      { type: 'slab', x: 0, y: 0.6, angle: 0 },
    ];
    const precariousStack = [
      { type: 'pillar', x: 0, y: 1.2, angle: 0 },
      { type: 'block', x: 0, y: 2.6, angle: 0 },
    ];
    const stableResult = runStressTest(stableStack, { intensity: 'light' });
    const precariousResult = runStressTest(precariousStack, { intensity: 'light' });
    expect(precariousResult.precariousness).toBeGreaterThan(stableResult.precariousness);
  });

  it('heavy intensity produces more displacement than light', () => {
    const bodies = [
      { type: 'wall', x: 0, y: 0.9, angle: 0 },
      { type: 'slab', x: 0, y: 2.0, angle: 0 },
    ];
    const light = runStressTest(bodies, { intensity: 'light' });
    const heavy = runStressTest(bodies, { intensity: 'heavy' });
    expect(heavy.totalDisplacement).toBeGreaterThanOrEqual(light.totalDisplacement);
  });
});
