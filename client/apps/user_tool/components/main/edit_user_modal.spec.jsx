import React from 'react';
import { shallow } from 'enzyme';

import { EditUserModal } from './edit_user_modal';

describe('EditUserModal', () => {
  const props = {
    updateUser: () => {},
    closeModal: () => {},
    user: {
      name: 'George Washington',
      email: 'countryfather@revolution.com',
      roles: ['admin', 'teacher'],
      login_id: 'countryfather@revolution.com',
      sis_user_id: 'george_123',
    },
  };

  it('renders the edit user modal', () => {
    const modal = shallow(
      <EditUserModal
        updateUser={props.updateUser}
        isOpen
        closeModal={props.closeModal}
        user={props.user}
      />
    );

    expect(modal).toMatchSnapshot();
  });

  describe('when the close/x button is clicked', () => {
    it('closes the modal', () => {
      spyOn(props, 'closeModal');
      const modal = shallow(
        <EditUserModal
          updateUser={props.updateUser}
          isOpen
          closeModal={props.closeModal}
          user={props.user}
        />
      );

      modal.find('button').first().simulate('click');

      expect(props.closeModal).toHaveBeenCalled();
    });
  });

  describe('when the cancel button is clicked', () => {
    it('closes the modal', () => {
      spyOn(props, 'closeModal');
      const modal = shallow(
        <EditUserModal
          updateUser={props.updateUser}
          isOpen
          closeModal={props.closeModal}
          user={props.user}
        />
      );

      modal.find('button').at(1).simulate('click');

      expect(props.closeModal).toHaveBeenCalled();
    });
  });

  describe('when the user updates and submits the form', () => {
    it('submits an update request', () => {
      spyOn(props, 'updateUser');
      const modal = shallow(
        <EditUserModal
          updateUser={props.updateUser}
          isOpen
          closeModal={props.closeModal}
          user={props.user}
        />
      );
      const nameInput = modal.find('#user_name');
      const loginIdInput = modal.find('#user_login_id');
      const passwordInput = modal.find('#user_password');
      const sisUserIdInput = modal.find('#user_sis_user_id');
      const emailInput = modal.find('#user_email');
      const newName = 'Updated Name';
      const newLoginId = 'Update Login Id';
      const newPassword = 'Updated Password';
      const newSisUserId = 'Updated SIS ID';
      const newEmail = 'Updated Email';

      expect(nameInput.prop('value')).toEqual(props.user.name);
      expect(loginIdInput.prop('value')).toEqual(props.user.login_id);
      expect(passwordInput.prop('value')).toEqual('');
      expect(sisUserIdInput.prop('value')).toEqual(props.user.sis_user_id);
      expect(emailInput.prop('value')).toEqual(props.user.email);

      nameInput.simulate('change', { target: { name: 'name', value: newName } });
      loginIdInput.simulate('change', { target: { name: 'loginId', value: newLoginId } });
      passwordInput.simulate('change', { target: { name: 'password', value: newPassword } });
      sisUserIdInput.simulate('change', { target: { name: 'sisUserId', value: newSisUserId } });
      emailInput.simulate('change', { target: { name: 'email', value: newEmail } });

      modal.find('button[type="submit"]').simulate('click', { preventDefault: () => {} });

      expect(props.updateUser).toHaveBeenCalledWith(
        props.user.id,
        props.user.login_id,
        {
          name: newName,
          loginId: newLoginId,
          password: newPassword,
          sisUserId: newSisUserId,
          email: newEmail,
        },
      );
    });
  });
});
