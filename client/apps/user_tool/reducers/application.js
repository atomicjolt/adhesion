import { Constants as ApplicationConstants } from '../actions/application';

const initialState = () => ({ matchingUsers: [] });

export default (state = initialState(), action) => {
  switch (action.type) {

    case ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE: {
      const {
        matching_users:matchingUsers,
        previous_page:previousPage,
        next_page:nextPage
      } = action.payload;

      return { ...state, ...{ matchingUsers, previousPage, nextPage } };
    }

    default:
      return state;
  }
};
