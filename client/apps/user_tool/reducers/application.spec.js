import applicationReducer from './application';
import { Constants as ApplicationConstants } from '../actions/application';

describe('application reducer', () => {
  const initialState = () => ({ matchingUsers: [], currentPage: 1 });

  describe('initial state', () => {
    it('returns empty state', () => {
      const state = applicationReducer(initialState, {});

      expect(state).toEqual(initialState);
    });
  });

  describe('SEARCH_FOR_ACCOUNT_USERS', () => {
    it('updates the currentPage', () => {
      const page = 2;
      const action = {
        type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS,
        params: { page }
      };

      const state = applicationReducer(initialState, action);

      expect(state.currentPage).toEqual(page);
    });

    describe('when no page is given', () => {
      it('defaults the currentPage to 1', () => {
        const action = {
          type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS,
          params: {}
        };

        const state = applicationReducer(initialState, action);

        expect(state.currentPage).toEqual(1);
      });
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

    it('updates previousPageAvailable', () => {
      const previousPageAvailable = true;
      const action = {
        type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE,
        payload: { previous_page_available: previousPageAvailable },
      };

      const state = applicationReducer(initialState, action);

      expect(state.previousPageAvailable).toEqual(previousPageAvailable);
    });

    it('updates nextPage', () => {
      const nextPageAvailable = true;
      const action = {
        type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE,
        payload: { next_page_available: nextPageAvailable },
      };

      const state = applicationReducer(initialState, action);

      expect(state.nextPageAvailable).toEqual(nextPageAvailable);
    });
  });
});
