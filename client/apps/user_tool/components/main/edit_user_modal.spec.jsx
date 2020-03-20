import React from 'react';
import { shallow } from 'enzyme';

import EditUserModal from './edit_user_modal';

describe('EditUserModal', () => {
  const props = {
    closeModal: () => {},
    user: {
      sortable_name: 'Washington, George',
      email: 'countryfather@revolution.com',
      roles: ['admin', 'teacher'],
      login_id: 'countryfather@revolution.com',
      sis_user_id: 'george_123',
    },
  };

  it('renders the edit user modal', () => {
    const modal = shallow(
      <EditUserModal isOpen closeModal={props.closeModal} userToEdit={props.user} />
    );

    expect(modal).toMatchSnapshot();
  });

  describe('when the close/x button is clicked', () => {
    it('closes the modal', () => {
      spyOn(props, 'closeModal');
      const modal = shallow(
        <EditUserModal isOpen closeModal={props.closeModal} userToEdit={props.user} />
      );

      modal.find('button').simulate('click');

      expect(props.closeModal).toHaveBeenCalled();
    });
  });
});
