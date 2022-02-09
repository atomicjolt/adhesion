import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

export default class PdfDisplay extends Component {
  static propTypes = {
    pdfDownloadUrl: PropTypes.string,
    sessionError: PropTypes.bool,
  };

  static get errorContainer() {
    return (
      <div id="error-container">
        <div className="absolute-center">
          <div style={{ margin: 'auto', fontSize: '1.8rem' }}>
            <span>error fetching session</span>
          </div>
        </div>
      </div>
    );
  }

  static get loadingSVG() {
    return (
      <div className="absolute-center">
        <div className="aj-loader">Loading</div>
      </div>
    );
  }

  constructor(props, context) {
    super(props, context);
    this.handleResize = _.throttle(this.setDivSize, 500);
  }

  state = {
    numPages: null,
    width: null,
  }

  componentDidMount() {
    this.setDivSize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  setDivSize = () => {
    // https://github.com/wojtekmaj/react-pdf/issues/129#issuecomment-359136222
    this.setState({ width: this.pdfWrapper.getBoundingClientRect().width });
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
      width,
    } = this.state;

    const {
      pdfDownloadUrl,
      sessionError,
    } = this.props;

    if (sessionError) {
      return PdfDisplay.errorContainer;
    }

    return (
      <div id="pdfWrapper" style={{ width: '100vw' }} ref={ref => this.pdfWrapper = ref}>
        { pdfDownloadUrl ?
          <Document
            file={pdfDownloadUrl}
            onLoadSuccess={this.onDocumentLoadSuccess}
            renderMode="svg"
            loading={PdfDisplay.loadingSVG}
          >
            {Array.from(
              new Array(numPages),
              (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderMode="svg"
                  loading=""
                  width={width}
                />
              ),
            )}
          </Document>
          :
          PdfDisplay.loadingSVG
        }
      </div>
    );
  }
}
