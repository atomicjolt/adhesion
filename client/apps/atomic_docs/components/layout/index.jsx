import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSessionStatus } from '../../actions/application';

import PdfDisplay from '../common/pdf_display';

const select = state => ({
  statusUrl: state.settings.status_url,
  pdfDownloadUrl: state.application.pdfDownloadUrl,
  sessionError: state.application.sessionError,
});

export class Index extends React.Component {

  static propTypes = {
    getSessionStatus: PropTypes.func.isRequired,
    statusUrl: PropTypes.string.isRequired,
    pdfDownloadUrl: PropTypes.string,
    sessionError: PropTypes.bool,
  };

  static defaultProps = {}

  componentDidMount() {
    const {
      statusUrl,
    } = this.props;

    this.props.getSessionStatus(statusUrl);
  }

  render() {
    const {
      pdfDownloadUrl,
      sessionError,
    } = this.props;

    return (
      <div className="app-index">
        <PdfDisplay
          pdfDownloadUrl={pdfDownloadUrl}
          sessionError={sessionError}
        />
      </div>
    );
  }

}

export default connect(select, { getSessionStatus })(Index);
