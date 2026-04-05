// src/game/stress-test.js
import { World, Vec2, Edge, Box, Circle } from 'planck';
import { STONE_TYPES } from '../shared/stone-types.js';
import { GRAVITY, BALL_RADIUS } from '../shared/constants.js';

const CONFIGS = {
  light: { impulse: 1.5, steps: 150, maxDisplacement: 4.0 },
  heavy: { impulse: 5.0, steps: 400, maxDisplacement: 8.0 },
};

/**
 * Run a stress test on a set of body positions.
 *
 * @param {Array<{type: string, x: number, y: number, angle: number}>} bodies
 *   Body definitions — can include stone types (from STONE_TYPES) and balls (type: 'ball')
 * @param {{ intensity: 'light' | 'heavy' }} options
 * @returns {{ precariousness: number, totalDisplacement: number }}
 */
export function runStressTest(bodies, { intensity = 'light' } = {}) {
  const config = CONFIGS[intensity];

  // Create temporary world
  const world = new World({ gravity: Vec2(0, GRAVITY) });
  const ground = world.createBody();
  ground.createFixture(Edge(Vec2(-100, 0), Vec2(100, 0)), { friction: 0.8 });

  // Add bodies and record initial positions
  const testBodies = [];

  for (const def of bodies) {
    let body;
    if (def.type === 'ball') {
      body = world.createDynamicBody({ position: Vec2(def.x, def.y), angle: def.angle || 0 });
      body.createFixture(Circle(BALL_RADIUS), { density: 1.5, friction: 0.8, restitution: 0.3 });
    } else {
      const stoneType = STONE_TYPES[def.type];
      if (!stoneType) continue;
      body = world.createDynamicBody({ position: Vec2(def.x, def.y), angle: def.angle || 0 });
      body.createFixture(Box(stoneType.width / 2, stoneType.height / 2), {
        density: stoneType.density,
        friction: stoneType.friction,
        restitution: stoneType.restitution,
      });
    }
    testBodies.push(body);
  }

  // Let the structure settle first (50 steps)
  for (let i = 0; i < 50; i++) {
    world.step(1 / 60, 8, 3);
  }

  // Record pre-perturbation positions
  const prePositions = testBodies.map(b => ({ x: b.getPosition().x, y: b.getPosition().y }));

  // Apply lateral impulse to all bodies
  for (const body of testBodies) {
    body.applyLinearImpulse(Vec2(config.impulse, 0), body.getWorldCenter());
    body.setAwake(true);
  }

  // Step forward
  for (let i = 0; i < config.steps; i++) {
    world.step(1 / 60, 8, 3);
  }

  // Measure total displacement from pre-perturbation positions
  let totalDisplacement = 0;
  for (let i = 0; i < testBodies.length; i++) {
    const pos = testBodies[i].getPosition();
    const pre = prePositions[i];
    const dx = pos.x - pre.x;
    const dy = pos.y - pre.y;
    totalDisplacement += Math.sqrt(dx * dx + dy * dy);
  }

  // Normalize to 0-1 precariousness
  const precariousness = Math.min(1, totalDisplacement / config.maxDisplacement);

  return { precariousness, totalDisplacement };
}

export function getIntegrityTier(score) {
  if (score >= 70) return 'Rock Solid';
  if (score >= 40) return 'Holding Together';
  return 'Barely Standing';
}
