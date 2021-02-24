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
      hasComments: false,
      selectedAnnotation: false,
      renderOptions: {
        url: null,
        documentId: null,
        pdfDocument: null,
        numPages: null,
        scale: 1,
        rotate: 0,
        pageHeight: null
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
    const { submission, allAnnotations } = this.props;
    if (prevProps.allAnnotations !== allAnnotations) {
      this.findComments(allAnnotations);
    }
    if (prevProps.submission !== submission) {
      const renderOptions = {
        url: submission.url,
        pdfDocument: null,
        documentId: submission.id,
        numPages: null,
        scale: 1,
        rotate: 0,
        pageHeight: null,
      };
      this.loadApp(renderOptions);
    }
  }

  handleSelection = (selectedAnnotation) => {
    this.setState({ selectedAnnotation });
  }

  findComments(allAnnotations) {
    for (let i = 0; i < allAnnotations.length; i++) {
      if (allAnnotations[i].annotationComments.length) {
        this.setState({ hasComments: true });
        return;
      }
    }
    this.setState({ hasComments: false });
  }

  toggleSecondary = (tool) => {
    if (tool) {
      this.setState({ showSecondary: true });
    } else {
      this.setState({ showSecondary: false });
    }
  }

  loadApp(renderOptions) {
    this.setState({ renderOptions }, () => {
      this.loadAdapter();
      this.loadPdf();
    });
  }

  renderPdf = () => {
    const { rendered, renderOptions } = this.state;
    if (rendered) return;
    for (let page = 0; page < renderOptions.numPages; page += 1) {
      this.UI.renderPage(page + 1, renderOptions).then(([pdfPage]) => {
        const viewport = pdfPage.getViewport({
          scale: renderOptions.scale,
          rotation: renderOptions.rotate,
        });
        this.setState({
          rendered: true,
          renderOptions: {
            ...renderOptions,
            pageHeight: viewport.height
          }
        });
      });
    }
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
          pdfDocument: pdf,
          numPages: pdf.numPages
        }
      });
      this.viewer.innerHTML = '';

      for (let i = 0; i < pdf.numPages; i += 1) {
        const page = this.UI.createPage(i + 1);
        this.viewer.appendChild(page);
      }
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
    const { renderOptions, showSecondary, hasComments, selectedAnnotation } = this.state;
    const { allAnnotations } = this.props;
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
          hasComments={hasComments}
          handleRerender={this.handleRerender}
          handleSelection={this.handleSelection}
        />
        <div id="wrapper" className="wrapper">
          <div
            id="viewer"
            className={`pdfViewer ${hasComments || selectedAnnotation ? 'has-comment-section': ''}`}
          />
        </div>
      </React.Fragment>
    );
  }
}

Docviewer.propTypes = {
  getSubmission: PropTypes.func.isRequired,
  submission: PropTypes.object,
  allAnnotations: PropTypes.arrayOf(PropTypes.shape({}))
};

const select = state => ({
  submission: state.submissions.submission,
  allAnnotations: state.annotations.allAnnotations,
});

export default connect(
  select,
  { ...submissionActions },
)(Docviewer);
