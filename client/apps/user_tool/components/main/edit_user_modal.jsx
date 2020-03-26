import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { connect } from 'react-redux';
import { updateUser } from '../../actions/application';

const select = state => ({
  lmsAccountId: state.settings.custom_canvas_account_id,
});

export class EditUserModal extends React.Component {
  static propTypes = {
    updateUser: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    lmsAccountId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super();

    const { user } = props;

    this.state = {
      userForm: {
        name: user.name,
        loginId: user.login_id,
        password: '',
        sisUserId: user.sis_user_id,
        email: user.email
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;

    this.setState((state) => {
      const { userForm } = state;

      userForm[name] = value;

      return { userForm };
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const {
      lmsAccountId,
      user,
      updateUser:update,
      closeModal
    } = this.props;
    const { userForm } = this.state;

    update(lmsAccountId, user.id, user.login_id, userForm);

    closeModal();
  }

  render() {
    const { isOpen, closeModal } = this.props;
    const { userForm } = this.state;

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
          <label htmlFor="user_name">
            Name
            <input
              id="user_name"
              name="name"
              type="text"
              value={userForm.name}
              onChange={this.handleInputChange}
            />
          </label>

          <label htmlFor="user_login_id">
            Login ID
            <input
              id="user_login_id"
              name="loginId"
              type="text"
              value={userForm.loginId}
              onChange={this.handleInputChange}
            />
          </label>

          <label htmlFor="user_password">
            Password
            <input
              id="user_password"
              name="password"
              type="password"
              value={userForm.password}
              placeholder="****************"
              onChange={this.handleInputChange}
            />
          </label>

          <label htmlFor="user_sis_user_id">
            SIS ID
            <input
              id="user_sis_user_id"
              name="sisUserId"
              type="text"
              value={userForm.sisUserId}
              onChange={this.handleInputChange}
            />
          </label>

          <label htmlFor="user_email">
            Email
            <input
              id="user_email"
              name="email"
              type="email"
              value={userForm.email}
              onChange={this.handleInputChange}
            />
          </label>

          <button type="submit" onClick={event => this.handleSubmit(event)}>Update User</button>
        </form>
      </ReactModal>
    );
  }
}

export default connect(select, { updateUser })(EditUserModal);
