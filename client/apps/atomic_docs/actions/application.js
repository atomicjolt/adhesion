import wrapper from 'atomic-fuel/libs/constants/wrapper';
import Network from 'atomic-fuel/libs/constants/network';

// Local actions
const actions = [];

// Actions that make an api request
const requests = [
  'GET_SESSION_STATUS',
  'POST_DOCUMENT',
];

export const Constants = wrapper(actions, requests);

export function getSessionStatus(statusUrl) {
  return {
    type: Constants.GET_SESSION_STATUS,
    method: Network.GET,
    url: statusUrl,
  };
}

export function postDocument(url) {
  return {
    type: Constants.POST_DOCUMENT,
    method: Network.POST,
    url: 'api/atomic_docs/documents',
    params: { url: url }
  };
}
