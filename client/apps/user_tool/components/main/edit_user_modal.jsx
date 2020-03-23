import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

export default class EditUserModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    userToEdit: PropTypes.object.isRequired,
  };

  constructor() {
    super();

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { isOpen, closeModal, userToEdit:user } = this.props;

    return (
      <ReactModal
        contentLabel="Edit User Modal"
        isOpen={isOpen}
        onRequestClose={closeModal}
      >
        <h2>Edit User</h2>
        <button type="button" onClick={closeModal}>
          <i className="material-icons">close</i>
        </button>

        <form>
          <label htmlFor="user_name">Name</label>
          <input id="user_name" type="text" defaultValue={user.name} name="userName" onChange={this.handleInputChange} />

          <label htmlFor="user_login_id">Login ID</label>
          <input id="user_login_id" type="text" defaultValue={user.login_id} name="userLoginId" onChange={this.handleInputChange} />

          <label htmlFor="user_password">Password</label>
          <input id="user_password" type="password" defaultValue="************" name="userPassword" onChange={this.handleInputChange} />

          <label htmlFor="user_sis_id">SIS ID</label>
          <input id="user_sis_id" type="text" defaultValue={user.sis_user_id} name="userSisId" onChange={this.handleInputChange} />

          <label htmlFor="user_email">Email</label>
          <input id="user_email" type="email" defaultValue={user.email} name="userEmail" onChange={this.handleInputChange} />
        </form>
      </ReactModal>
    );
  }
}
