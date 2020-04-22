import { Constants as ApplicationConstants } from '../actions/application';
import { Constants as SuccessMessagesConstants } from '../actions/success_messages';

const initialState = () => ([]);

export default (state = initialState(), action) => {
  switch (action.type) {
    case SuccessMessagesConstants.CLEAR_SUCCESS_MESSAGES: {
      return [];
    }

    case ApplicationConstants.UPDATE_ACCOUNT_USER_DONE: {
      if (!action.error) {
        return [...state, 'User updated successfully.'];
      }

      return state;
    }

    default:
      return state;
  }
};
