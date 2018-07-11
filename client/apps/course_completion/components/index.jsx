import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Selector from './content_item_select/selector';

const select = state => ({
  ltiMessageType: state.settings.lti_message_type,
});

export class Index extends React.PureComponent {
  static propTypes = {
    ltiMessageType: PropTypes.string,
    children: PropTypes.node,
  };

  render() {
    if (this.props.ltiMessageType === 'ContentItemSelectionRequest') {
      return <Selector />;
    }
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default connect(select, {})(Index);
