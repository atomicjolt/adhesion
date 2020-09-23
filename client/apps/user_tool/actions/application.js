import wrapper from 'atomic-fuel/libs/constants/wrapper';
import Network from 'atomic-fuel/libs/constants/network';

// Increasing timeout to accomodate slow environments. Default is 20_000.
Network.TIMEOUT = 60_000;

// Local actions
const actions = [];

// Actions that make an api request
const requests = ['SEARCH_FOR_ACCOUNT_USERS', 'GET_ACCOUNT_USER', 'UPDATE_ACCOUNT_USER'];

export const Constants = wrapper(actions, requests);

export const searchForAccountUsers = (searchTerm, page) => {
  const encodedSearchTerm = encodeURIComponent(searchTerm);

  return {
    type: Constants.SEARCH_FOR_ACCOUNT_USERS,
    method: Network.GET,
    url: 'api/canvas_account_users',
    params: {
      search_term: encodedSearchTerm,
      page,
    },
  };
};

export const getAccountUser = userId => ({
  type: Constants.GET_ACCOUNT_USER,
  method: Network.GET,
  url: `api/canvas_account_users/${userId}`,
});

export const updateAccountUser = (userId, userAttributes) => ({
  type: Constants.UPDATE_ACCOUNT_USER,
  method: Network.PUT,
  url: `api/canvas_account_users/${userId}`,
  body: {
    user: {
      name: userAttributes.name,
      login_id: userAttributes.loginId,
      sis_user_id: userAttributes.sisUserId,
      email: userAttributes.email,
    },
  },
});
