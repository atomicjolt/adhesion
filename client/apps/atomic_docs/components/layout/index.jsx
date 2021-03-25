import React from 'react';
import Communicator from 'atomic-fuel/libs/communications/communicator';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Docviewer from '../main/docviewer';
import PdfDisplay from '../common/pdf_display';
import * as applicationActions from '../../actions/application';

export class Index extends React.Component {
  constructor() {
    super();
    this.communicator = new Communicator('*');
    this.state = {
      context: 'pdfDisplay',
    };
  }

  handleComm(e) {
    const message = Communicator.parseMessageFromEvent(e);
    if (message && 'subject' in message) {
      const { subject } = message;
      if (subject === 'app.studentReviewPage' || subject === 'app.speedgraderPage') {
        this.setState({ context: 'docviewer' });
      }
    }
  }

  componentDidMount() {
    this.communicator.enableListener(this);
    const {
      statusUrl,
      getSessionStatus,
    } = this.props;

    getSessionStatus(statusUrl);
  }

  componentWillUnmount() {
    this.communicator.removeListener();
  }

  render() {
    const { context } = this.state;
    const {
      pdfDownloadUrl,
      sessionError,
    } = this.props;

    return (
      <div className="app-index">
        { context === 'pdfDisplay'
          && <PdfDisplay
            pdfDownloadUrl={pdfDownloadUrl}
            sessionError={sessionError}
          />}
        { context === 'docviewer' && <Docviewer /> }
      </div>
    );
  }
}

Index.propTypes = {
  getSessionStatus: PropTypes.func,
  statusUrl: PropTypes.string,
  pdfDownloadUrl: PropTypes.string,
  sessionError: PropTypes.bool,
};

const select = state => ({
  statusUrl: state.settings.status_url,
  pdfDownloadUrl: state.application.pdfDownloadUrl,
  sessionError: state.application.sessionError,
});

export default connect(select, { ...applicationActions })(Index);
