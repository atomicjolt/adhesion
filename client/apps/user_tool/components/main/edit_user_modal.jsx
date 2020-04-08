import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { connect } from 'react-redux';
import { updateUser } from '../../actions/application';

const select = () => ({});

export class EditUserModal extends React.Component {
  static propTypes = {
    updateUser: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  static initialState(props) {
    const { user } = props;

    return ({
      confirmingUpdates: false,
      userForm: {
        name: user.name,
        loginId: user.login_id,
        password: '',
        sisUserId: user.sis_user_id,
        email: user.email
      },
    });
  }

  constructor(props) {
    super();

    this.state = EditUserModal.initialState(props);

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
      user,
      updateUser:update,
      closeModal
    } = this.props;
    const { confirmingUpdates, userForm } = this.state;

    if (confirmingUpdates) {
      update(user.id, user.login_id, userForm);

      closeModal();
    } else {
      this.setState({ confirmingUpdates: true });
    }
  }

  handleCancel() {
    const { closeModal } = this.props;

    this.setState(EditUserModal.initialState(this.props));

    closeModal();
  }

  renderButtons() {
    const { confirmingUpdates } = this.state;

    // TODO: Update these CSS classes with real classes.
    let submitButtonText = 'Update';
    let cancelButtonClass = 'white';
    let submitButtonClass = 'black';

    if (confirmingUpdates) {
      submitButtonText = 'Confirm';
      cancelButtonClass = 'red';
      submitButtonClass = 'green';
    }

    return (
      <React.Fragment>
        <button type="button" className={cancelButtonClass} onClick={() => this.handleCancel()}>
          Cancel
        </button>
        <button
          type="submit"
          className={submitButtonClass}
          onClick={event => this.handleSubmit(event)}
        >
          {submitButtonText}
        </button>
      </React.Fragment>
    );
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
            New Password
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

          {this.renderButtons()}
        </form>
      </ReactModal>
    );
  }
}

export default connect(select, { updateUser })(EditUserModal);
