import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ContentItemSelectionForm from 'atomic-canvas/libs/lti/components/content_item_selection_form';

import { embedLtiIframe } from 'atomic-canvas/libs/lti/content_item_selection';

import { createLtiLaunch } from '../../actions/lti_launches';
import { getContentItemSelection } from '../../actions/content_items';

const select = state => ({
  contentItemReturnURL: state.settings.content_item_return_url,
  apiUrl : state.settings.api_url,
  contentItemSelection: state.contentItemSelection,
});

export class Selector extends React.Component {

  static propTypes = {
    contentItemReturnURL: PropTypes.string,
    apiUrl: PropTypes.string,
    contentItemSelection: PropTypes.shape({}),
  };

  componentDidMount() {
    const contentItem = embedLtiIframe(`${this.props.apiUrl}lti_launches`, 'auto', 'auto');
    this.props.getContentItemSelection(
      this.props.contentItemReturnURL,
      contentItem
    );
  }

  render() {
    if (!_.isEmpty(this.props.contentItemSelection)) {
      return (
        <ContentItemSelectionForm
          launchData={this.props.contentItemSelection}
          contentItemReturnURL={this.props.contentItemReturnURL}
        />
      );
    }

    return (
      // TODO: Make loading page or similar
      <div>
      Please wait, embedding tool...
      </div>
    );
  }

}

export default connect(select, { getContentItemSelection, createLtiLaunch })(Selector);
