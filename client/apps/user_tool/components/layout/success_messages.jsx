import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { clearSuccessMessages } from '../../actions/success_messages';

const select = state => ({ messages: state.successMessages });

export class SuccessMessages extends React.Component {
  static propTypes = {
    clearSuccessMessages: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired,
  }

  componentDidUpdate() {
    const { clearSuccessMessages:clear, messages } = this.props;

    if (_.isEmpty(messages)) { return; }

    setTimeout(() => {
      clear();
    }, 4000);
  }

  render() {
    const { messages } = this.props;

    const renderedMessages = _.map(messages,
      (message, index) => <li key={index}>{message}</li>
    );

    return (
      <div id="success-messages" aria-live="polite">
        { !_.isEmpty(renderedMessages) && (
          <div className="messages success">
            <ul>{renderedMessages}</ul>
          </div>
        )}
      </div>
    );
  }
}

export default connect(select, { clearSuccessMessages })(SuccessMessages);
