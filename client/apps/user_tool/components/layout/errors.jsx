import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearErrors } from 'atomic-fuel/libs/actions/errors';

const select = state => ({ errors: state.errors });

export class Errors extends React.Component {
  static propTypes = {
    clearErrors: PropTypes.func.isRequired,
    errors: PropTypes.array.isRequired,
  }

  handleClearKeyPress(event) {
    const { clearErrors:clear } = this.props;

    if (event.key === 'enter' || event.key === 'space') {
      clear();
    }
  }

  render() {
    const { clearErrors:clear, errors } = this.props;

    if (_.isEmpty(errors)) { return false; }

    const errorMessages = _.map(errors,
      (error, index) => <li key={index}>{error.message}</li>
    );

    return (
      <div className="errors">
        <button type="button" onClick={clear} onKeyPress={event => this.handleClearKeyPress(event)}>
          <i className="material-icons">clear</i>
        </button>
        <ul>{errorMessages}</ul>
      </div>
    );
  }
}

export default connect(select, { clearErrors })(Errors);
