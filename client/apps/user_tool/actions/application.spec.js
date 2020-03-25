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
    const lmsAccountId = 123;
    const userId = 45;
    const originalUserLoginId = 'adamsforindepence@greatbritain.com';
    const userAttributes = {
      name: 'John Adams',
      loginId: 'adamsforindependence@revolution.com',
      password: 'new_password',
      sisUserId: 'john_123',
      email: 'adamsforindependence@revolution.com'
    };

    it('generates the correct action', () => {
      const expectedAction = {
        type: 'UPDATE_USER',
        method: 'put',
        url: `api/canvas_accounts/${lmsAccountId}/canvas_users/${userId}`,
        body: {
          original_user_login_id: originalUserLoginId,
          user: {
            name: userAttributes.name,
            login_id: userAttributes.loginId,
            sis_user_id: userAttributes.sisUserId,
            email: userAttributes.email,
            password: userAttributes.password,
          }
        }
      };

      expect(updateUser(lmsAccountId, userId, originalUserLoginId, userAttributes))
        .toEqual(expectedAction);
    });

    describe('when no password is given', () => {
      it('does not send a password property', () => {
        delete userAttributes.password;

        const expectedAction = {
          type: 'UPDATE_USER',
          method: 'put',
          url: `api/canvas_accounts/${lmsAccountId}/canvas_users/${userId}`,
          body: {
            original_user_login_id: originalUserLoginId,
            user: {
              name: userAttributes.name,
              login_id: userAttributes.loginId,
              sis_user_id: userAttributes.sisUserId,
              email: userAttributes.email,
            }
          }
        };

        expect(updateUser(lmsAccountId, userId, originalUserLoginId, userAttributes))
          .toEqual(expectedAction);
      });
    });
  });
});
