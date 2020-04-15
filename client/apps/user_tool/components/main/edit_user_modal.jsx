import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import _ from 'lodash';
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

    const { user, updateUser:update, closeModal } = this.props;
    const { confirmingUpdates, userForm } = this.state;

    if (confirmingUpdates) {
      update(user.id, userForm);

      this.setState({ confirmingUpdates: false });

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

  renderAttributeChange(attribute) {
    const { user } = this.props;
    const { confirmingUpdates, userForm } = this.state;

    if (!confirmingUpdates || userForm[_.camelCase(attribute)] === user[attribute]) {
      return false;
    }

    if (attribute === 'password') {
      if (_.isEmpty(userForm.password)) {
        return false;
      }

      return <span>Changed</span>;
    }

    return <span>Was: {user[attribute]}</span>;
  }

  renderButtons() {
    const { confirmingUpdates } = this.state;

    let submitButtonText = 'Update';
    let cancelButtonClasses = 'btn--outline';
    let submitButtonClasses = 'btn--primary';

    if (confirmingUpdates) {
      submitButtonText = 'Confirm';
      cancelButtonClasses = 'btn--primary is-red';
      submitButtonClasses = 'btn--primary is-green';
    }

    return (
      <React.Fragment>
        <button
          className={`btn ${cancelButtonClasses}`}
          type="button"
          onClick={() => this.handleCancel()}
        >
          Cancel
        </button>
        <button
          className={`btn ${submitButtonClasses}`}
          type="submit"
          onClick={event => this.handleSubmit(event)}
        >
          {submitButtonText}
        </button>
      </React.Fragment>
    );
  }

  render() {
    const { isOpen, closeModal } = this.props;
    const { confirmingUpdates, userForm } = this.state;

    return (
      <ReactModal
        contentLabel="Edit User Modal"
        isOpen={isOpen}
        onRequestClose={closeModal}
        overlayClassName="modal__background"
        className="modal"
      >
        <div className="modal__top">
          <h2>Edit User</h2>
          <button type="button" onClick={closeModal} aria-label="close modal">
            <i className="material-icons" aria-hidden="true">close</i>
          </button>
        </div>

        <form>
          <div className="modal__main">
            <div className="row">
              <div className="column u-half">
                <div className="input">
                  <label htmlFor="user_name">Name</label>
                  <input
                    id="user_name"
                    name="name"
                    type="text"
                    value={userForm.name}
                    onChange={this.handleInputChange}
                  />
                  { this.renderAttributeChange('name') }
                </div>
                <div className="input">
                  <label htmlFor="user_sis_user_id">SIS ID</label>
                  <input
                    id="user_sis_user_id"
                    name="sisUserId"
                    type="text"
                    value={userForm.sisUserId}
                    onChange={this.handleInputChange}
                  />
                  { this.renderAttributeChange('sis_user_id') }
                </div>
                <div className="input">
                  <label htmlFor="user_email">Email</label>
                  <input
                    id="user_email"
                    name="email"
                    type="email"
                    value={userForm.email}
                    onChange={this.handleInputChange}
                  />
                  { this.renderAttributeChange('email') }
                </div>
              </div>
              <div className="column u-half">
                <div className="input">
                  <label htmlFor="user_login_id">Login ID</label>
                  <input
                    id="user_login_id"
                    name="loginId"
                    type="text"
                    value={userForm.loginId}
                    onChange={this.handleInputChange}
                  />
                  { this.renderAttributeChange('login_id') }
                </div>
                <div className="input">
                  <label htmlFor="user_password">New Password</label>
                  <input
                    id="user_password"
                    name="password"
                    type="password"
                    value={userForm.password}
                    placeholder="****************"
                    onChange={this.handleInputChange}
                  />
                  { this.renderAttributeChange('password') }
                </div>
              </div>
            </div>
          </div>
          <div className="modal__bottom">
            { confirmingUpdates && (
              <p>Are you sure you want to apply the current changes to this user?</p>
            )}

            {this.renderButtons()}
          </div>
        </form>
      </ReactModal>
    );
  }
}

export default connect(select, { updateUser })(EditUserModal);
