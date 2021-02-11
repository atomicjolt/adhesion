import React from 'react';
import PDFJSAnnotate from 'pdf-annotate.js';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import Communicator, { broadcastRawMessage } from 'atomic-fuel/libs/communications/communicator';
import MyAdapter from '../../libs/my_adapter';
import PrimaryToolbar from './primary_toolbar';
import CommentsSection from './comments_section';
import * as submissionActions from '../../actions/submissions';

export class Docviewer extends React.Component {
  constructor() {
    super();
    this.communicator = new Communicator('*');
    this.state = {
      rendered: false,
      showSecondary: false,
      renderOptions: {
        url: null,
        documentId: null,
        pdfDocument: null,
        scale: 1,
        rotate: 0
      }
    };
  }

  handleComm(e) {
    const { getSubmission } = this.props;
    const message = Communicator.parseMessageFromEvent(e);
    if (message && 'subject' in message) {
      const { subject } = message;
      if (subject === 'app.submissionSelectionChange') {
        this.handleRerender();
      }
    } else if (message) {
      const {
        courseId,
        assignmentId,
        studentId,
        submissionId
      } = message;
      getSubmission(courseId, assignmentId, studentId, submissionId);
    }
  }

  componentDidMount() {
    this.communicator.enableListener(this);
    broadcastRawMessage('{ "subject": "app.loaded" }');
  }

  componentWillUnmount() {
    this.communicator.removeListener();
  }

  componentDidUpdate(prevProps) {
    const { submission } = this.props;
    if (prevProps.submission !== submission) {
      const renderOptions = {
        url: submission.url,
        pdfDocument: null,
        documentId: submission.id,
        scale: 1,
        rotate: 0
      };
      this.loadApp(renderOptions);
    }
  }

  toggleSecondary = (tool) => {
    if (tool) {
      this.setState({ showSecondary: true });
    } else {
      this.setState({ showSecondary: false });
    }
  }


  loadApp(renderOptions) {
    this.setState({ renderOptions }, async() => {
      this.loadAdapter();
      this.loadPdf();
    });
  }

  renderPdf = () => {
    const { rendered, renderOptions } = this.state;
    if (rendered) return;
    this.UI.renderPage(1, renderOptions).then(([pdfPage]) => {
      const viewport = pdfPage.getViewport({
        scale: renderOptions.scale,
        rotation: renderOptions.rotate,
      });
      this.PAGE_HEIGHT = viewport.height;
      this.setState({ rendered: true });
    });
  }

  handleRerender = () => {
    this.setState({ rendered: false }, () => {
      this.renderPdf();
    });
  }

  loadPdf() {
    const { renderOptions } = this.state;
    const loadingDocument = pdfjsLib.getDocument(renderOptions.url);
    loadingDocument.promise.then((pdf) => {
      this.setState({
        renderOptions: {
          ...renderOptions,
          pdfDocument: pdf
        }
      });
      this.viewer.innerHTML = '';

      for (let i = 0; i < pdf.numPages; i += 1) {
        const page = this.UI.createPage(i + 1);
        this.viewer.appendChild(page);
      }
      this.viewer.appendChild(this.UI.createPage(1));
      window.pdfjsViewer = pdfjsViewer;
      this.handleRerender();
    });
  }

  loadAdapter() {
    const { UI } = PDFJSAnnotate;
    this.viewer = document.getElementById('viewer');
    this.adapter = new MyAdapter();
    PDFJSAnnotate.setStoreAdapter(this.adapter);
    this.UI = UI;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';
  }

  render() {
    const { renderOptions, showSecondary } = this.state;
    return (
      <React.Fragment>
        <PrimaryToolbar
          UI={this.UI}
          RENDER_OPTIONS={renderOptions}
          handleRerender={this.handleRerender}
          toggleSecondary={this.toggleSecondary}
          showSecondary={showSecondary}
        />
        <CommentsSection
          UI={this.UI}
          showSecondary={showSecondary}
        />
        <div id="viewer" className="pdfViewer" />
      </React.Fragment>
    );
  }
}

Docviewer.propTypes = {
  getSubmission: PropTypes.func.isRequired,
  submission: PropTypes.object
};

const select = state => ({
  submission: state.submissions.submission,
});

export default connect(
  select,
  { ...submissionActions },
)(Docviewer);
