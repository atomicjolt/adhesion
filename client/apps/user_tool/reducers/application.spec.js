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
    it('updates matchingUsers', () => {
      const matchingUsers = [
        { id: 1, name: 'Student 1' },
        { id: 2, name: 'Student 2' },
        { id: 3, name: 'Student 3' },
      ];
      const action = {
        type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE,
        payload: { matching_users: matchingUsers },
      };

      const state = applicationReducer(initialState, action);

      expect(state.matchingUsers).toEqual(matchingUsers);
    });

    it('updates previousPage', () => {
      const previousPage = '2'
      const action = {
        type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE,
        payload: { previous_page: previousPage },
      };

      const state = applicationReducer(initialState, action);

      expect(state.previousPage).toEqual(previousPage);
    });

    it('updates nextPage', () => {
      const nextPage = '4';
      const action = {
        type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE,
        payload: { next_page: nextPage },
      };

      const state = applicationReducer(initialState, action);

      expect(state.nextPage).toEqual(nextPage);
    });
  });
});
