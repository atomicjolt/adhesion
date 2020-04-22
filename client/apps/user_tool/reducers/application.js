import { Constants as ApplicationConstants } from '../actions/application';

const defaultPage = 1;
const initialState = () => ({
  matchingUsers: [],
  currentPage: defaultPage,
  previousPageAvailable: false,
  nextPageAvailable: false,
  isSearching: false,
  isUpdatingUser: false,
});

export default (state = initialState(), action) => {
  switch (action.type) {

    case ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS: {
      const currentPage = action.params.page || defaultPage;

      return { ...state, currentPage, isSearching: true };
    }

    case ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE: {
      const {
        previous_page_available:previousPageAvailable,
        next_page_available:nextPageAvailable,
      } = action.payload;
      const matchingUsers = action.payload.matching_users || [];

      return {
        ...state,
        matchingUsers,
        previousPageAvailable,
        nextPageAvailable,
        isSearching: false,
      };
    }

    case ApplicationConstants.UPDATE_USER: {
      return { ...state, isUpdatingUser: true };
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

      return { ...state, matchingUsers, isUpdatingUser: false };
    }

    default:
      return state;
  }
};
