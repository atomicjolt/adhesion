import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchForAccountUsers } from '../../actions/application';
import UserSearchResult from './user_search_result';

const select = state => ({
  matchingUsers: state.application.matchingUsers,
  lmsAccountId: state.settings.custom_canvas_account_id,
  previousPage: state.application.previousPage,
  nextPage: state.application.nextPage,
});

export class SearchPage extends React.Component {
  static propTypes = {
    searchForAccountUsers: PropTypes.func.isRequired,
    matchingUsers: PropTypes.array.isRequired,
    lmsAccountId: PropTypes.string.isRequired,
    previousPage: PropTypes.string,
    nextPage: PropTypes.string,
  };

  constructor() {
    super();

    this.state = { searchTerm: '' };
    this.minSearchTermLength = 3;
  }

  updateSearchTerm(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleSearch() {
    const { lmsAccountId, searchForAccountUsers:search } = this.props;
    const { searchTerm } = this.state;

    if (searchTerm.length >= this.minSearchTermLength) {
      search(lmsAccountId, searchTerm);
    }
  }

  render() {
    const {
      searchForAccountUsers:search,
      lmsAccountId,
      matchingUsers,
      previousPage,
      nextPage
    } = this.props;
    const { searchTerm } = this.state;
    const renderedUsers = matchingUsers.map(user => (
      <UserSearchResult key={user.id} user={user} />
    ));

    return (
      <div>
        <form>
          <input
            type="search"
            minLength={this.minSearchTermLength}
            value={searchTerm}
            onChange={event => this.updateSearchTerm(event)}
            placeholder="Search for students..."
          />
          <button type="submit" onClick={() => this.handleSearch()}>Search</button>
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
        <a href="#" onClick={() => search(lmsAccountId, searchTerm, previousPage)}>Previous</a>
        ...
        <a href="#" onClick={() => search(lmsAccountId, searchTerm, nextPage)}>Next</a>
      </div>
    );
  }
}

export default connect(select, { searchForAccountUsers })(SearchPage);
