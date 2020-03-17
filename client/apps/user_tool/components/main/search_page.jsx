import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchForAccountUsers } from '../../actions/application';
import UserSearchResult from './user_search_result';

const select = state => ({
  matchingUsers: state.application.matchingUsers,
  lmsAccountId: state.settings.custom_canvas_account_id,
});

export class SearchPage extends React.Component {
  static propTypes = {
    searchForAccountUsers: PropTypes.func.isRequired,
    matchingUsers: PropTypes.array.isRequired,
    lmsAccountId: PropTypes.string.isRequired,
  };

  constructor() {
    super();

    this.state = { searchTerm: '' };

    this.updateSearchTerm = this.updateSearchTerm.bind(this);
  }

  updateSearchTerm(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchForAccountUsers:search, matchingUsers, lmsAccountId } = this.props;
    const { searchTerm } = this.state;
    const renderedUsers = matchingUsers.map(user => (
      <UserSearchResult key={user.id} user={user} />
    ));

    return (
      <div>
        <form>
          <input type="search" value={searchTerm} onChange={this.updateSearchTerm} placeholder="Search for students..." />
          <button type="submit" onClick={() => search(lmsAccountId, searchTerm)}>Search</button>
        </form>
        <p>Search Results:</p>
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email Address</th>
              <th scope="col">Roles</th>
              <th scope="col">Login ID</th>
              <th scope="col">SIS ID</th>
            </tr>
          </thead>
          <tbody>
            {renderedUsers}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(select, { searchForAccountUsers })(SearchPage);
