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
    it('resets the form to default values', () => {
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
      const newName = 'Updated Name';
      const newLoginId = 'Update Login Id';
      const cancelButton = modal.find('button').at(1);

      expect(nameInput.prop('value')).toEqual(props.user.name);
      expect(loginIdInput.prop('value')).toEqual(props.user.login_id);

      nameInput.simulate('change', { target: { name: 'name', value: newName } });
      loginIdInput.simulate('change', { target: { name: 'loginId', value: newLoginId } });

      expect(modal.find('#user_name').prop('value')).toEqual(newName);
      expect(modal.find('#user_login_id').prop('value')).toEqual(newLoginId);

      cancelButton.simulate('click');

      expect(modal.find('#user_name').prop('value')).toEqual(props.user.name);
      expect(modal.find('#user_login_id').prop('value')).toEqual(props.user.login_id);
    });

    it('resets the submission button to "Update"', () => {
      const modal = shallow(
        <EditUserModal
          updateUser={props.updateUser}
          isOpen
          closeModal={props.closeModal}
          user={props.user}
        />
      );
      let submitButton = modal.find('button[type="submit"]');
      const cancelButton = modal.find('button').at(1);

      expect(submitButton.text()).toEqual('Update');

      submitButton.simulate('click', { preventDefault: () => {} });

      submitButton = modal.find('button[type="submit"]');
      expect(submitButton.text()).toEqual('Confirm');

      cancelButton.simulate('click');

      submitButton = modal.find('button[type="submit"]');
      expect(submitButton.text()).toEqual('Update');
    });

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
      const cancelButton = modal.find('button').at(1);

      cancelButton.simulate('click');

      expect(props.closeModal).toHaveBeenCalled();
    });
  });

  describe('when the user updates, confirms and submits the form', () => {
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
      // Click again to confirm.
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

    it('resets the submission button to "Update"', () => {
      const modal = shallow(
        <EditUserModal
          updateUser={props.updateUser}
          isOpen
          closeModal={props.closeModal}
          user={props.user}
        />
      );
      let submitButton = modal.find('button[type="submit"]');

      expect(submitButton.text()).toEqual('Update');

      submitButton.simulate('click', { preventDefault: () => {} });
      // Click again to confirm.
      submitButton.simulate('click', { preventDefault: () => {} });

      submitButton = modal.find('button[type="submit"]');
      expect(submitButton.text()).toEqual('Update');
    });
  });

  describe('when the user clicks the Update button', () => {
    it('the button text changes to "Confirm"', () => {
      const modal = shallow(
        <EditUserModal
          updateUser={props.updateUser}
          isOpen
          closeModal={props.closeModal}
          user={props.user}
        />
      );
      let submitButton = modal.find('button[type="submit"]');

      expect(submitButton.text()).toEqual('Update');

      submitButton.simulate('click', { preventDefault: () => {} });

      submitButton = modal.find('button[type="submit"]');
      expect(submitButton.text()).toEqual('Confirm');
    });

    it('displays the confirmation message', () => {
      const modal = shallow(
        <EditUserModal
          updateUser={props.updateUser}
          isOpen
          closeModal={props.closeModal}
          user={props.user}
        />
      );
      const submitButton = modal.find('button[type="submit"]');
      let form = modal.find('form');

      expect(form.text()).toEqual(expect.not.stringContaining('Are you sure you'));

      submitButton.simulate('click', { preventDefault: () => {} });

      form = modal.find('form');

      expect(form.text()).toEqual(expect.stringContaining('Are you sure you'));
    });

    it('renders the changed attributes', () => {
      const modal = shallow(
        <EditUserModal
          updateUser={props.updateUser}
          isOpen
          closeModal={props.closeModal}
          user={props.user}
        />
      );
      const submitButton = modal.find('button[type="submit"]');
      const nameInput = modal.find('#user_name');
      const loginIdInput = modal.find('#user_login_id');
      const passwordInput = modal.find('#user_password');
      const sisUserIdInput = modal.find('#user_sis_user_id');
      const emailInput = modal.find('#user_email');

      nameInput.simulate('change', { target: { name: 'name', value: 'Updated Name' } });
      loginIdInput.simulate('change', { target: { name: 'loginId', value: 'Updated Login Id' } });
      passwordInput.simulate('change', { target: { name: 'password', value: 'Updated Password' } });
      sisUserIdInput.simulate('change', { target: { name: 'sisUserId', value: 'Updated SIS ID' } });
      emailInput.simulate('change', { target: { name: 'email', value: 'Updated Email' } });

      submitButton.simulate('click', { preventDefault: () => {} });

      expect(modal.find('form')).toMatchSnapshot();
    });
  });
});
