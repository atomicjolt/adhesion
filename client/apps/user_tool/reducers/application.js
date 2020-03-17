import { Constants as ApplicationConstants } from '../actions/application';

const initialState = () => ({ matchingUsers: [] });

export default (state = initialState(), action) => {
  switch (action.type) {

    case ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE: {
      const matchingUsers = action.payload;

      return { ...state, ...{ matchingUsers } };
    }

    default:
      return state;
  }
};
