import { Constants as ApplicationConstants } from '../actions/application';

const defaultPage = 1;
const initialState = () => ({ matchingUsers: [], currentPage: defaultPage });

export default (state = initialState(), action) => {
  switch (action.type) {

    case ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS: {
      const currentPage = action.params.page || defaultPage;

      return { ...state, currentPage };
    }

    case ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE: {
      const {
        matching_users:matchingUsers,
        previous_page_available:previousPageAvailable,
        next_page_available:nextPageAvailable,
      } = action.payload;

      return {
        ...state,
        matchingUsers,
        previousPageAvailable,
        nextPageAvailable
      };
    }

    case ApplicationConstants.UPDATE_USER_DONE: {
      const {
        id,
        name,
        login_id,
        sis_user_id,
        email
      } = action.payload;

      const matchingUsers = state.matchingUsers.map((user) => {
        if (user.id === Number(id)) {
          return {
            ...user,
            name,
            login_id,
            sis_user_id,
            email
          };
        }

        return user;
      });

      return { ...state, matchingUsers };
    }

    default:
      return state;
  }
};
