import React from 'react';
import PropTypes from 'prop-types';

export default class UserSearchResult extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  render() {
    const { user } = this.props;

    return (
      <tr>
        <td>{user.sortable_name}</td>
        <td>{user.email}</td>
        <td>{user.roles}</td>
        <td>{user.login_id}</td>
        <td>{user.sis_user_id}</td>
      </tr>
    );
  }
}
