import React from 'react';
import { shallow } from 'enzyme';

import UserSearchResult from './user_search_result';

describe('UserSearchResult', () => {
  const user = {
    sortable_name: 'Washington, George',
    email: 'countryfather@revolution.com',
    roles: ['admin', 'teacher'],
    login_id: 'countryfather@revolution.com',
    sis_user_id: 'george_123',
  };

  it('renders the user as a search result', () => {
    const result = shallow(<UserSearchResult user={user} />);

    expect(result).toMatchSnapshot();
  });
});
