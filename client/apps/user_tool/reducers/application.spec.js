import applicationReducer from './application';
import { Constants as ApplicationConstants } from '../actions/application';

describe('application reducer', () => {
  const initialState = opts => ({
    matchingUsers: (opts && opts.matchingUsers) || [],
    currentPage: (opts && opts.currentPage) || 1,
    isSearching: (opts && opts.isSearching) || false,
  });

  describe('initial state', () => {
    it('returns empty state', () => {
      const state = applicationReducer(initialState(), {});

      expect(state).toEqual(initialState());
    });
  });

  describe('SEARCH_FOR_ACCOUNT_USERS', () => {
    it('updates the currentPage', () => {
      const page = 2;
      const action = {
        type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS,
        params: { page }
      };

      const state = applicationReducer(initialState(), action);

      expect(state.currentPage).toEqual(page);
    });

    it('sets isSearching to true', () => {
      const action = {
        type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS,
        params: {},
      };

      const state = applicationReducer(initialState(), action);

      expect(state.isSearching).toEqual(true);
    });

    describe('when no page is given', () => {
      it('defaults the currentPage to 1', () => {
        const action = {
          type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS,
          params: {}
        };

        const state = applicationReducer(initialState(), action);

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

      const state = applicationReducer(initialState(), action);

      expect(state.matchingUsers).toEqual(matchingUsers);
    });

    it('updates previousPageAvailable', () => {
      const previousPageAvailable = true;
      const action = {
        type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE,
        payload: { previous_page_available: previousPageAvailable },
      };

      const state = applicationReducer(initialState(), action);

      expect(state.previousPageAvailable).toEqual(previousPageAvailable);
    });

    it('updates nextPage', () => {
      const nextPageAvailable = true;
      const action = {
        type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE,
        payload: { next_page_available: nextPageAvailable },
      };

      const state = applicationReducer(initialState(), action);

      expect(state.nextPageAvailable).toEqual(nextPageAvailable);
    });

    it('sets isSearching to false', () => {
      const action = {
        type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE,
        payload: {},
      };

      const state = applicationReducer(initialState({ isSearching: true }), action);

      expect(state.isSearching).toEqual(false);
    });

    describe('when the action payload contains a falsey value for matching_users', () => {
      it('sets matchingUsers to an empty array', () => {
        const matchingUsers = undefined;
        const action = {
          type: ApplicationConstants.SEARCH_FOR_ACCOUNT_USERS_DONE,
          payload: { matching_users: matchingUsers },
        };

        const state = applicationReducer(initialState(), action);

        expect(state.matchingUsers).toEqual([]);
      });
    });
  });

  describe('UPDATE_USER_DONE', () => {
    it('updates the user in matchingUsers', () => {
      const matchingUsers = [
        {
          id: 1,
          name: 'George Washington',
          login_id: 'countryfather@revolution.com',
          sis_user_id: 'george_123',
          email: 'countryfather@revolution.com',
        },
        {
          id: 2,
          name: 'John Adams',
          login_id: 'adamsforindependence@greatbritain.com',
          sis_user_id: 'john_123',
          email: 'adamsforindependence@greatbritain.com',
        },
        {
          id: 3,
          name: 'Thomas Jefferson',
          login_id: 'idodeclare@revolution.com',
          sis_user_id: 'thomas_123',
          email: 'idodeclare@revolution.com',
        },
      ];
      const updatedUser = {
        id: 2,
        name: 'John Adams',
        login_id: 'adamsforindependence@revolution.com',
        sis_user_id: 'john_123',
        email: 'adamsforindependence@revolution.com'
      };
      const action = {
        type: ApplicationConstants.UPDATE_USER_DONE,
        payload: updatedUser,
      };

      const state = applicationReducer({ ...initialState(), matchingUsers }, action);

      expect(state.matchingUsers[1]).toEqual(updatedUser);
    });
  });
});
