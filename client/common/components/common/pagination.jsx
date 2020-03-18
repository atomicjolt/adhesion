import React from 'react';
import PropTypes from 'prop-types';

class Pagination extends React.Component {
  static propTypes = {
    changePageTo: PropTypes.func.isRequired, // A function that accepts the new page number.
    currentPage: PropTypes.number,
    previousPageAvailable: PropTypes.bool,
    nextPageAvailable: PropTypes.bool,
  }

  renderPreviousButton() {
    const { previousPageAvailable } = this.props;

    return (
      <button
        type="button"
        disabled={!previousPageAvailable}
        onClick={() => { this.handlePreviousPageClick(); }}
      >
        &lt;
      </button>
    );
  }

  renderNextButton() {
    const { nextPageAvailable } = this.props;

    return (
      <button
        type="button"
        disabled={!nextPageAvailable}
        onClick={() => { this.handleNextPageClick(); }}
      >
        &gt;
      </button>
    );
  }

  handlePreviousPageClick() {
    const { changePageTo, currentPage } = this.props;

    changePageTo(currentPage - 1);
  }

  handleNextPageClick() {
    const { changePageTo, currentPage } = this.props;

    changePageTo(currentPage + 1);
  }

  render() {
    return (
      <nav>
        <ul>
          {this.renderPreviousButton()}
          {this.renderNextButton()}
        </ul>
      </nav>
    );
  }
}

export default Pagination;
