import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSessionStatus } from '../../actions/application';
import Errors from './errors';

import PdfDisplay from '../common/pdf_display';

const select = state => ({
  statusUrl: state.settings.status_url,
  pdfDownloadUrl: state.application.pdfDownloadUrl,
});

export class Index extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    getSessionStatus: PropTypes.func.isRequired,
    statusUrl: PropTypes.string.isRequired,
    pdfDownloadUrl: PropTypes.string,
  };

  static defaultProps = {
    children: '',
  }

  componentDidMount() {
    const {
      statusUrl,
    } = this.props;

    this.props.getSessionStatus(statusUrl);
  }

  render() {
    const {
      pdfDownloadUrl,
    } = this.props;

    return (
      <div className="app-index">
        <PdfDisplay
          pdfDownloadUrl={pdfDownloadUrl}
        />
        <Errors />
        {this.props.children}
      </div>
    );
  }

}

export default connect(select, { getSessionStatus })(Index);
