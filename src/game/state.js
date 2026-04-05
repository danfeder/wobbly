import { MAX_SHOTS } from '../shared/constants.js';

export const STATES = {
  AIMING: 'AIMING',
  FLYING: 'FLYING',
  SETTLING: 'SETTLING',
  ROUND_OVER: 'ROUND_OVER',
  WIN: 'WIN',
};

const state = {
  current: STATES.AIMING,
  shotNumber: 1,
  result: null, // 'miss', 'topple', 'win'
  landedBalls: [],
  precariousness: 0,
};

export function getState() {
  return state;
}

export function setState(newState) {
  state.current = newState;
}

export function getShotNumber() {
  return state.shotNumber;
}

export function advanceShot() {
  state.shotNumber++;
  if (state.shotNumber > MAX_SHOTS) {
    state.current = STATES.WIN;
    state.result = 'win';
    return false;
  }
  state.current = STATES.AIMING;
  return true;
}

export function addLandedBall(ball) {
  state.landedBalls.push(ball);
}

export function getLandedBalls() {
  return state.landedBalls;
}

export function setPrecariousness(value) {
  state.precariousness = value;
}

export function setRoundOver(reason) {
  state.current = STATES.ROUND_OVER;
  state.result = reason;
}

export function resetState() {
  state.current = STATES.AIMING;
  state.shotNumber = 1;
  state.result = null;
  state.landedBalls = [];
  state.precariousness = 0;
}
