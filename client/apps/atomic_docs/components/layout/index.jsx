import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSessionStatus } from '../../actions/application';

import PdfDisplay from '../common/pdf_display';
import Docviewer from '../main/docviewer';

const select = state => ({
  statusUrl: state.settings.status_url,
  pdfDownloadUrl: state.application.pdfDownloadUrl,
  sessionError: state.application.sessionError,
});

export default class Index extends React.Component {
  render() {
    return (
      <div className="app-index">
        <Docviewer />
      </div>
    );
  }
}
