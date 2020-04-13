import React from 'react';
import PropTypes from 'prop-types';

export default class NoSearchResults extends React.Component {
  static propTypes = {
    searchTerm: PropTypes.string.isRequired,
  };

  render() {
    const { searchTerm } = this.props;

    return (
      <div className="no-results">
        <h2>
          Your search -
          <strong> {searchTerm} </strong>
          - did not match any of the available students.
        </h2>
        <h3>Suggestions:</h3>
        <ul>
          <li>Double check your spelling</li>
          <li>Try more general keywords</li>
          <li>Try different keywords</li>
        </ul>
      </div>
    );
  }
}
