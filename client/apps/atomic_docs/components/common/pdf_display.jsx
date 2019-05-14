import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = window.DEFAULT_SETTINGS.pdf_worker_js_url;

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
};

// Some code inspired by example:
// https://github.com/wojtekmaj/react-pdf/issues/129#issuecomment-359136222
export default class PdfDisplay extends Component {
  static propTypes = {
    pdfDownloadUrl: PropTypes.string,
  };

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

    return (
      <div id="pdfWrapper" style={{ width: '100vw' }} ref={ref => this.pdfWrapper = ref}>
        { pdfDownloadUrl ?
          <Document
            file={pdfDownloadUrl}
            onLoadSuccess={this.onDocumentLoadSuccess}
            renderMode="svg"
            loading={loadingSVG}
            options={options}
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
          loadingSVG
        }
      </div>
    );
  }
}
