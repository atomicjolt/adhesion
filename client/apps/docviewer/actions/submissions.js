import wrapper from 'atomic-fuel/libs/constants/wrapper';
import Network from 'atomic-fuel/libs/constants/network';

// Local actions
const actions = [];

// Actions that make an api request
const requests = [
  'GET_SUBMISSION',
];

export const Constants = wrapper(actions, requests);

export const getSubmission = id => ({
  method: Network.GET,
  type: Constants.GET_SUBMISSION,
  url: `/api/submissions/${id}`,
  params: { id }
});
