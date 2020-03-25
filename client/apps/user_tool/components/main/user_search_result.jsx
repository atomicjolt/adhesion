import React from 'react';
import PropTypes from 'prop-types';
import EditUserModal from './edit_user_modal';

export default class UserSearchResult extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  constructor() {
    super();

    this.state = { editUserModalIsOpen: false };
  }

  showEditUserModal(directive) {
    this.setState({ editUserModalIsOpen: directive });
  }

  render() {
    const { user } = this.props;
    const { editUserModalIsOpen } = this.state;

    return (
      <React.Fragment>
        <tr>
          <td>
            <button type="button" onClick={() => this.showEditUserModal(true)}>
              {user.name}
            </button>
          </td>
          <td>{user.login_id}</td>
          <td>{user.sis_user_id}</td>
          <td>{user.roles}</td>
          <td>{user.email}</td>
        </tr>

        <EditUserModal
          isOpen={editUserModalIsOpen}
          closeModal={() => this.showEditUserModal(false)}
          userToEdit={user}
        />
      </React.Fragment>
    );
  }
}
