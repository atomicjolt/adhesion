import React, { Component } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import PropTypes from 'prop-types';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
