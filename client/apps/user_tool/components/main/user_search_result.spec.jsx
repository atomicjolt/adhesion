import React from 'react';
import { shallow } from 'enzyme';

import UserSearchResult from './user_search_result';

describe('UserSearchResult', () => {
  const user = {
    name: 'George Washington',
    login_id: 'countryfather@revolution.com',
    sis_user_id: 'george_123',
    email: 'countryfather@revolution.com',
  };

  it('renders the user as a search result', () => {
    const result = shallow(<UserSearchResult user={user} />);

    expect(result).toMatchSnapshot();
  });

  describe('when the edit user button is clicked', () => {
    it('opens the edit user modal', () => {
      const userSearchResult = shallow(<UserSearchResult user={user} />);

      let modalComponent = userSearchResult.find('Connect(EditUserModal)');
      expect(modalComponent.prop('isOpen')).toBe(false);

      userSearchResult.find('button').simulate('click');

      modalComponent = userSearchResult.find('Connect(EditUserModal)');
      expect(modalComponent.prop('isOpen')).toBe(true);
    });
  });
});
