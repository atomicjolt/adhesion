import React from 'react';
import { shallow } from 'enzyme';

import EditUserModal from './edit_user_modal';

describe('EditUserModal', () => {
  const user = {
    sortable_name: 'Washington, George',
    email: 'countryfather@revolution.com',
    roles: ['admin', 'teacher'],
    login_id: 'countryfather@revolution.com',
    sis_user_id: 'george_123',
  };

  it('renders the edit user modal', () => {
    const result = shallow(<EditUserModal isOpen closeModal={() => {}} userToEdit={user} />);

    expect(result).toMatchSnapshot();
  });
});
