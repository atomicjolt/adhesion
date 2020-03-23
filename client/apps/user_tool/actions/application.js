import wrapper from 'atomic-fuel/libs/constants/wrapper';
import Network from 'atomic-fuel/libs/constants/network';

// Local actions
const actions = [];

// Actions that make an api request
const requests = ['SEARCH_FOR_ACCOUNT_USERS', 'UPDATE_USER'];

export const Constants = wrapper(actions, requests);

export const searchForAccountUsers = (lmsAccountId, searchTerm, page) => ({
  type: Constants.SEARCH_FOR_ACCOUNT_USERS,
  method: Network.GET,
  url: `api/canvas_accounts/${lmsAccountId}/canvas_users`,
  params: {
    search_term: searchTerm,
    page,
  },
});

export const updateUser = (lmsAccountId, userId, userAttributes) => ({
  type: Constants.UPDATE_USER,
  method: Network.PUT,
  url: `api/canvas_accounts/${lmsAccountId}/canvas_users/${userId}`,
  params: {
    userAttributes
  }
});
