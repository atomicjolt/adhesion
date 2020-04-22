import successMessagesReducer from './success_messages';
import { Constants as ApplicationConstants } from '../actions/application';
import { Constants as SuccessMessagesConstants } from '../actions/success_messages';

describe('success messages reducer', () => {
  const initialState = state => (state || []);

  describe('initial state', () => {
    it('returns empty state', () => {
      const state = successMessagesReducer(undefined, {});

      expect(state).toEqual(initialState());
    });
  });

  describe('CLEAR_SUCCESS_MESSAGES', () => {
    it('clears the success messages', () => {
      const action = {
        type: SuccessMessagesConstants.CLEAR_SUCCESS_MESSAGES,
      };

      const state = successMessagesReducer(initialState(['Message']), action);

      expect(state).toEqual([]);
    });
  });

  describe('UPDATE_USER_DONE', () => {
    describe('when the action has no errors', () => {
      it('adds a success message to state', () => {
        const action = {
          type: ApplicationConstants.UPDATE_USER_DONE,
          payload: {},
        };

        const state = successMessagesReducer(initialState(), action);

        expect(state).toEqual(['User updated successfully.']);
      });
    });

    describe('when the action has an error', () => {
      it('does not add a success message to state', () => {
        const action = {
          type: ApplicationConstants.UPDATE_USER_DONE,
          payload: {},
          error: { message: 'Something went wrong.' },
        };

        const state = successMessagesReducer(initialState(), action);

        expect(state).toEqual([]);
      });
    });
  });
});
