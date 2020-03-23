import { searchForAccountUsers, updateUser } from './application';

describe('application actions', () => {
  describe('searchForAccountUsers', () => {
    it('generates the correct action', () => {
      const lmsAccountId = 123;
      const searchTerm = 'student name';
      const page = '2';
      const expectedAction = {
        type: 'SEARCH_FOR_ACCOUNT_USERS',
        method: 'get',
        url: `api/canvas_accounts/${lmsAccountId}/canvas_users`,
        params: {
          search_term: searchTerm,
          page,
        },
      };

      expect(searchForAccountUsers(lmsAccountId, searchTerm, page)).toEqual(expectedAction);
    });

    describe('when no search term is given', () => {
      it('generates the correct action', () => {
        const lmsAccountId = 123;
        const searchTerm = '';
        const page = '2';
        const expectedAction = {
          type: 'SEARCH_FOR_ACCOUNT_USERS',
          method: 'get',
          url: `api/canvas_accounts/${lmsAccountId}/canvas_users`,
          params: {
            search_term: searchTerm,
            page,
          },
        };

        expect(searchForAccountUsers(lmsAccountId, searchTerm, page)).toEqual(expectedAction);
      });
    });
  });

  describe('updateUser', () => {
    it('generates the correct action', () => {
      const lmsAccountId = 123;
      const userId = 45;
      const userAttributes = {
        name: 'John Adams',
        loginId: '',
        password: '',
        sisId: 'john_123',
        email: ''
      };
      const expectedAction = {
        type: 'UPDATE_USER',
        method: 'put',
        url: `api/canvas_accounts/${lmsAccountId}/canvas_users/${userId}`,
        params: {
          userAttributes
        }
      };

      expect(updateUser(lmsAccountId, userId, userAttributes)).toEqual(expectedAction);
    });
  });
});
