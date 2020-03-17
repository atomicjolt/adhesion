import applicationReducer from './application';
import { Constants as ApplicationConstants } from '../actions/application';

describe('application reducer', () => {
  let initialState = () => ({ matchingUsers: [] });

  describe('initial state', () => {
    it('returns empty state', () => {
      const state = applicationReducer(initialState, {});

      expect(state).toEqual(initialState);
    });
  });

  describe('SEARCH_FOR_ACCOUNT_USERS_DONE', () => {
    it('updates matchingUsers with the response payload', () => {
      const matchingUsers = [
        { id: 1, name: 'Student 1' },
        { id: 2, name: 'Student 2' },
        { id: 3, name: 'Student 3' },
      ];
      const action = {
        type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE,
        payload: matchingUsers,
      };

      const state = applicationReducer(initialState, action);

      expect(state.matchingUsers).toEqual(matchingUsers);
    });

    describe('if there are no matching users', () => {
      it('updates matchingUsers to an empty list', () => {
        initialState = () => ({ matchingUsers: [{ id: 1, name: 'Student 1' }] });
        const action = {
          type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE,
          payload: [],
        };

        const state = applicationReducer(initialState, action);

        expect(state.matchingUsers).toEqual([]);
      });
    });
  });
});
