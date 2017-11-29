import wrapper from 'atomic-fuel/libs/constants/wrapper';

// Local actions
const actions = [
  'SHOW_MODAL',
  'HIDE_MODAL',
];

// Actions that make an api request
const requests = [];

export const Constants = wrapper(actions, requests);

export function hideModal() {
  return {
    type: Constants.HIDE_MODAL,
  };
}

export function showModal(children, props = {}) {
  return {
    type: Constants.SHOW_MODAL,
    children,
    props,
  };
}
