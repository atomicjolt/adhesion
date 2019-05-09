import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = window.DEFAULT_SETTINGS.pdf_worker_js_url;

export default class PdfDisplay extends Component {
  static propTypes = {
    pdfDownloadUrl: PropTypes.string,
  };

  state = {
    numPages: null,
  }

  onDocumentLoadSuccess = (document) => {
    const { numPages } = document;
    this.setState({
      numPages,
    });
  };

  render() {
    const {
      numPages,
    } = this.state;

    const {
      pdfDownloadUrl,
    } = this.props;

    if (!pdfDownloadUrl) {
      return null;
    }

    return (
      <Document
        file={pdfDownloadUrl}
        onLoadSuccess={this.onDocumentLoadSuccess}
      >
        {Array.from(
          new Array(numPages),
          (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
            />
          ),
        )}
      </Document>
    );
  }
}
