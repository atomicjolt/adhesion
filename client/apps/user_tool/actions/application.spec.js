import { searchForAccountUsers } from './application';

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
});
