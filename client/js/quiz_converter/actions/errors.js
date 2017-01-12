import wrapper from '../../constants/wrapper';

// Actions that make an api request
const actions = [
  'NEW_ERROR'
];

export const Constants = wrapper(actions, []);

export function newError(message) {
  return {
    type: Constants.NEW_ERROR,
    payload: message,
  };
}
