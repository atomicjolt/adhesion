import { searchForAccountUsers, getAccountUser, updateAccountUser } from './application';

describe('application actions', () => {
  describe('searchForAccountUsers', () => {
    it('generates the correct action', () => {
      const searchTerm = 'student name';
      const page = '2';
      const expectedAction = {
        type: 'SEARCH_FOR_ACCOUNT_USERS',
        method: 'get',
        url: 'api/canvas_account_users',
        params: {
          search_term: searchTerm,
          page,
        },
      };

      expect(searchForAccountUsers(searchTerm, page)).toEqual(expectedAction);
    });

    describe('when no search term is given', () => {
      it('generates the correct action', () => {
        const searchTerm = '';
        const page = '2';
        const expectedAction = {
          type: 'SEARCH_FOR_ACCOUNT_USERS',
          method: 'get',
          url: 'api/canvas_account_users',
          params: {
            search_term: searchTerm,
            page,
          },
        };

        expect(searchForAccountUsers(searchTerm, page)).toEqual(expectedAction);
      });
    });
  });

  describe('getAccountUser', () => {
    it('generates the correct action', () => {
      const userId = 123;
      const expectedAction = {
        type: 'GET_ACCOUNT_USER',
        method: 'get',
        url: `api/canvas_account_users/${userId}`,
      };

      expect(getAccountUser(userId)).toEqual(expectedAction);
    });
  });

  describe('updateAccountUser', () => {
    const userId = 45;
    const userAttributes = {
      name: 'John Adams',
      loginId: 'adamsforindependence@revolution.com',
      sisUserId: 'john_123',
      email: 'adamsforindependence@revolution.com'
    };

    it('generates the correct action', () => {
      const expectedAction = {
        type: 'UPDATE_ACCOUNT_USER',
        method: 'put',
        url: `api/canvas_account_users/${userId}`,
        body: {
          user: {
            name: userAttributes.name,
            login_id: userAttributes.loginId,
            sis_user_id: userAttributes.sisUserId,
            email: userAttributes.email,
          },
        },
      };

      expect(updateAccountUser(userId, userAttributes))
        .toEqual(expectedAction);
    });
  });
});
