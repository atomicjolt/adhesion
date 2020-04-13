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
      user,
      updateUser:update,
      closeModal
    } = this.props;
    const { userForm } = this.state;

    update(user.id, user.login_id, userForm);

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
                  <span>Was: Jeffery Danish</span>
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
                </div>
              </div>
            </div>
          </div>
          <div className="modal__bottom">
            <p>Are you sure you want to make the current changes to this user?</p>
            <button className="btn btn--outline">Cancel</button>
            <button className="btn btn--primary" type="submit" onClick={event => this.handleSubmit(event)}>Update</button>
          </div>
        </form>
      </ReactModal>
    );
  }
}

export default connect(select, { updateUser })(EditUserModal);
