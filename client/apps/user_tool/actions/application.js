import wrapper from 'atomic-fuel/libs/constants/wrapper';
import Network from 'atomic-fuel/libs/constants/network';

// Local actions
const actions = ['CLEAR_SUCCESS_MESSAGES'];

// Actions that make an api request
const requests = ['SEARCH_FOR_ACCOUNT_USERS', 'UPDATE_USER'];

export const Constants = wrapper(actions, requests);

export const clearSuccessMessages = () => ({
  type: Constants.CLEAR_SUCCESS_MESSAGES,
});

export const searchForAccountUsers = (searchTerm, page) => ({
  type: Constants.SEARCH_FOR_ACCOUNT_USERS,
  method: Network.GET,
  url: 'api/canvas_account_users',
  params: {
    search_term: searchTerm,
    page,
  },
});

export const updateUser = (userId, userAttributes) => ({
  type: Constants.UPDATE_USER,
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
