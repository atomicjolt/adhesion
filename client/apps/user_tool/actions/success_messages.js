import wrapper from 'atomic-fuel/libs/constants/wrapper';

// Local actions
const actions = ['CLEAR_SUCCESS_MESSAGES'];

// Actions that make an api request
const requests = [];

export const Constants = wrapper(actions, requests);

export const clearSuccessMessages = () => ({
  type: Constants.CLEAR_SUCCESS_MESSAGES,
});
