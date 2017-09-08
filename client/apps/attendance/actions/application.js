import wrapper from '../../constants/wrapper';

// Local actions
const actions = ['CHANGE_DATE'];

// Actions that make an api request
const requests = [];

export const Constants = wrapper(actions, requests);

export const changeDate = date => ({
  type: Constants.CHANGE_DATE,
  date,
});
