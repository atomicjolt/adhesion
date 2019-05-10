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

    const loadingSVG = (
      <div id="loading-container">
        <div className="absolute-center">
          <div title="Loading" className="AJSpinner AJSpinner--medium">
            <svg className="AJSpinner-svg" role="img" aria-labelledby="AJSpinner-5otot" focusable="false">
              <title id="AJSpinner-5otot">Loading</title>
              <g role="presentation">
                <circle className="AJSpinner-circleShadow" cx="50%" cy="50%" r="1.75em" />
                <circle className="AJSpinner-circleTrack" cx="50%" cy="50%" r="1.75em" />
                <circle className="AJSpinner-circleSpin" cx="50%" cy="50%" r="1.75em" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    );

    if (!pdfDownloadUrl) {
      return loadingSVG;
    }

    return (
      <Document
        file={pdfDownloadUrl}
        onLoadSuccess={this.onDocumentLoadSuccess}
        loading={loadingSVG}
      >
        {Array.from(
          new Array(numPages),
          (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              loading={loadingSVG}
            />
          ),
        )}
      </Document>
    );
  }
}
