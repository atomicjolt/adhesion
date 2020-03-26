import React from 'react';
import PropTypes from 'prop-types';

export default class NoSearchResults extends React.Component {
  static propTypes = {
    searchTerm: PropTypes.string.isRequired,
  };

  render() {
    const { searchTerm } = this.props;

    return (
      <section>
        <p>
          Your search - <strong>{searchTerm}</strong> - did not match any users.
        </p>
        <p>Suggestions:</p>
        <ul>
          <li>Double check your spelling.</li>
          <li>Try more general keywords.</li>
          <li>Try different keywords.</li>
        </ul>
      </section>
    );
  }
}
