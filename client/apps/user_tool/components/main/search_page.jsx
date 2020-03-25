import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchForAccountUsers } from '../../actions/application';
import UserSearchResult from './user_search_result';
import Pagination from '../../../../common/components/common/pagination';

const select = state => ({
  matchingUsers: state.application.matchingUsers,
  lmsAccountId: state.settings.custom_canvas_account_id,
  currentPage: state.application.currentPage,
  previousPageAvailable: state.application.previousPageAvailable,
  nextPageAvailable: state.application.nextPageAvailable,
});

export class SearchPage extends React.Component {
  static propTypes = {
    searchForAccountUsers: PropTypes.func.isRequired,
    matchingUsers: PropTypes.array.isRequired,
    lmsAccountId: PropTypes.string.isRequired,
    currentPage: PropTypes.number.isRequired,
    previousPageAvailable: PropTypes.bool,
    nextPageAvailable: PropTypes.bool,
  };

  constructor() {
    super();

    this.state = {
      inputSearchTerm: '', // The search term currently in the input field.
      resultsSearchTerm: '', // The search term associated with the currently displayed results.
    };
    this.minSearchTermLength = 3;
  }

  updateInputSearchTerm(event) {
    this.setState({ inputSearchTerm: event.target.value });
  }

  handleSearch(event) {
    event.preventDefault();
    event.target.form.reportValidity();

    const { lmsAccountId, searchForAccountUsers:search } = this.props;
    const { inputSearchTerm } = this.state;

    this.setState({ resultsSearchTerm: inputSearchTerm });

    if (inputSearchTerm.length >= this.minSearchTermLength) {
      search(lmsAccountId, inputSearchTerm);
    }
  }

  render() {
    const {
      searchForAccountUsers:search,
      lmsAccountId,
      matchingUsers,
      currentPage,
      previousPageAvailable,
      nextPageAvailable
    } = this.props;
    const { inputSearchTerm, resultsSearchTerm } = this.state;
    const renderedUsers = matchingUsers.map(user => (
      <UserSearchResult key={user.id} user={user} />
    ));

    return (
      <div>
        <form>
          <input
            type="search"
            minLength={this.minSearchTermLength}
            value={inputSearchTerm}
            onChange={event => this.updateInputSearchTerm(event)}
            placeholder="Search for students..."
          />
          <button type="submit" onClick={event => this.handleSearch(event)}>Search</button>
        </form>
        <p>Search Results:</p>
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Login ID</th>
              <th scope="col">SIS ID</th>
              <th scope="col">Roles</th>
              <th scope="col">Email Address</th>
            </tr>
          </thead>
          <tbody>
            {renderedUsers}
          </tbody>
        </table>
        <Pagination
          changePageTo={page => search(lmsAccountId, resultsSearchTerm, page)}
          currentPage={currentPage}
          previousPageAvailable={previousPageAvailable}
          nextPageAvailable={nextPageAvailable}
        />
      </div>
    );
  }
}

export default connect(select, { searchForAccountUsers })(SearchPage);
