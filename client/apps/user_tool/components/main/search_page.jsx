import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { searchForAccountUsers } from '../../actions/application';
import UserSearchResult from './user_search_result';
import StartSearching from './start_searching';
import NoSearchResults from './no_search_results';
import Pagination from '../../../../common/components/common/pagination';

const select = state => ({
  matchingUsers: state.application.matchingUsers,
  currentPage: state.application.currentPage,
  previousPageAvailable: state.application.previousPageAvailable,
  nextPageAvailable: state.application.nextPageAvailable,
});

export class SearchPage extends React.Component {
  static propTypes = {
    searchForAccountUsers: PropTypes.func.isRequired,
    matchingUsers: PropTypes.array.isRequired,
    currentPage: PropTypes.number.isRequired,
    previousPageAvailable: PropTypes.bool,
    nextPageAvailable: PropTypes.bool,
  };

  constructor() {
    super();

    this.state = {
      inputSearchTerm: '', // The search term currently in the input field.
      resultsSearchTerm: '', // The search term associated with the currently displayed results.
      hasSearched: false,
    };
    this.minSearchTermLength = 3;
  }

  updateInputSearchTerm(event) {
    this.setState({ inputSearchTerm: event.target.value });
  }

  handleSearch(event) {
    event.preventDefault();
    event.target.form.reportValidity();

    const { searchForAccountUsers:search } = this.props;
    const { inputSearchTerm } = this.state;

    if (inputSearchTerm.length >= this.minSearchTermLength) {
      this.setState({ resultsSearchTerm: inputSearchTerm, hasSearched: true });

      search(inputSearchTerm);
    }
  }

  render() {
    const {
      searchForAccountUsers:search,
      matchingUsers,
      currentPage,
      previousPageAvailable,
      nextPageAvailable
    } = this.props;
    const { inputSearchTerm, resultsSearchTerm, hasSearched } = this.state;
    const renderedUsers = matchingUsers.map(user => (
      <UserSearchResult key={user.id} user={user} />
    ));

    return (
      <div class="main">
        <form role="search" className="search">
          <label htmlFor="search" class="hidden">Search</label>
          <input
            type="search"
            name="search"
            id="search"
            minLength={this.minSearchTermLength}
            value={inputSearchTerm}
            onChange={event => this.updateInputSearchTerm(event)}
            placeholder="Search for students..."
          />
          <button type="submit" class="search__btn" onClick={event => this.handleSearch(event)}>Search</button>
        </form>
        <table className="search-results">
          <caption className="hidden">Search Results</caption>
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

        { !hasSearched && <StartSearching /> }

        {
          hasSearched
          && _.isEmpty(matchingUsers)
          && <NoSearchResults searchTerm={resultsSearchTerm} />
        }

        <div className="no-search">
          <h2>Search for a student by: Name, Login ID, SIS ID, or Email.</h2>
        </div>
        <div className="no-results">
          <h2>Your search - <strong>UserSearch</strong> - did not match any of the available students.</h2>
          <h3>Suggestions:</h3>
          <ul>
            <li>Double check your spelling</li>
            <li>Try more general keywords</li>
            <li>Try different keywords</li>
          </ul>
        </div>

        <Pagination
          changePageTo={page => search(resultsSearchTerm, page)}
          currentPage={currentPage}
          previousPageAvailable={previousPageAvailable}
          nextPageAvailable={nextPageAvailable}
        />
      </div>
    );
  }
}

export default connect(select, { searchForAccountUsers })(SearchPage);
