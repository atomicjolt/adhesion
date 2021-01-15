import React from 'react';
import PDFJSAnnotate from 'pdf-annotate.js';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FullScreen from 'react-full-screen';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import workerURL from '../../pdf.worker.min.data';
import MyAdapter from './my_adapter';
import PrimaryToolbar from './primary_toolbar';
import Communicator from 'atomic-fuel/libs/communications/communicator';
import { broadcastRawMessage } from 'atomic-fuel/libs/communications/communicator';
import * as submissionActions from '../../actions/submissions';

export class Docviewer extends React.Component {

  constructor(props) {
    super(props);
    this.communicator = new Communicator('*');
    this.state = {
      isFull: false,
      rendered: false,
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
    const courseExp = /\/courses\/([0-9]+)/;
    const assignmentExp = /\/assignments\/([0-9]+)/;
    const studentExp = /\/submissions\/([0-9]+)/;
    const submissionExp = /[?&]download=([^&]+).*$/;
    const message = Communicator.parseMessageFromEvent(e);
    if (message) {
      const courseId = message.match(courseExp)[1];
      const assignmentId = message.match(assignmentExp)[1];
      const studentId = message.match(studentExp)[1];
      const submissionId = message.match(submissionExp)[1];
      this.props.getSubmission(courseId, assignmentId, studentId, submissionId)
    }
  }

  componentDidMount() {
    this.communicator.enableListener(this);
    // this.getLastSubmission();
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
      }
      this.setState({ renderOptions }, async() => {
        this.loadAdapter();
        this.loadPdf();

      });
    }
  }

  renderPdf = () => {
    console.log('renderPdf this.state: ', this.state);
    if (this.state.rendered) return;
    this.UI.renderPage(1, this.state.renderOptions).then(([pdfPage, annotations]) => {
      console.log('annotations: ', annotations);
      const viewport = pdfPage.getViewport({
        scale: this.state.renderOptions.scale,
        rotation: this.state.renderOptions.rotate,
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
    console.log("loadPdf renderOptions: ", this.state.renderOptions);
    const loadingDocument = pdfjsLib.getDocument(this.state.renderOptions.url);
    loadingDocument.promise.then((pdf) => {
      this.setState({
        renderOptions: {
          ...this.state.renderOptions,
          pdfDocument: pdf
        }
      })
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

  handleFullScreen = () => {
    this.setState({ isFull: true });
  }

  render() {
    return (
      <div>
        <FullScreen
          enabled={this.state.isFull}
          onChange={(isFull) => this.setState({ isFull })}
        >
          <PrimaryToolbar
            UI={this.UI}
            RENDER_OPTIONS={this.state.renderOptions}
            handleRerender={this.handleRerender}
            handleFullScreen={this.handleFullScreen}
          />
          <div className="toolbar" />
          <div id="viewer" className="pdfViewer" />
        </FullScreen>
      </div>
    );
  }
}

Docviewer.propTypes = {
  getSubmission: PropTypes.func.isRequired,
  submission: PropTypes.shape({})
};

const select = (state) => ({
  submission: state.submissions.submission,
});

export default connect(
  select,
  { ...submissionActions },
)(Docviewer);
