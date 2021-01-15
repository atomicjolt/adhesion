import React from 'react';
import PDFJSAnnotate from 'pdf-annotate.js';
import { connect } from 'react-redux';
import FullScreen from 'react-full-screen';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import workerURL from '../../pdf.worker.min.data';
import MyAdapter from './my_adapter';
import PrimaryToolbar from './primary_toolbar';
import store from '../../app';
import Communicator from 'atomic-fuel/libs/communications/communicator';
import { broadcastRawMessage } from 'atomic-fuel/libs/communications/communicator';
import * as submissionActions from '../../actions/submissions';

// import render from './renderer';
const select = (state) => ({
  annotation: state.annotation,
  annotations: state.annotations,
  comment: state.comment,
});

export class Docviewer extends React.Component {
  constructor(props) {
    super();
    this.communicator = new Communicator('*');
    this.state = {
      isFull: false,
      rendered: false,
    };
  }

  handleComm(e) {
    console.log('handleComm e: ', e);
    debugger;
    const message = Communicator.parseMessageFromEvent(e);
    if (message) {
      // this.handleFileDownload(message)
      this.getSubmission(message)
    }
  }

  componentDidMount() {
    this.communicator.enableListener(this);
    this.getLastSubmission();
  }

  componentWillUnmount() {
    this.communicator.removeListener();
  }


  renderPdf = () => {
    if (this.state.rendered === true);
    this.UI.renderPage(1, this.RENDER_OPTIONS).then(([pdfPage, annotations]) => {
      const viewport = pdfPage.getViewport({
        scale: this.RENDER_OPTIONS.scale,
        rotation: this.RENDER_OPTIONS.rotate,
      });
      this.PAGE_HEIGHT = viewport.height;
      this.setState({ rendered: true });
    });
  }

  handleRerender = () => {
    this.setState({ rendered: false });
    this.renderPdf();
  }

  loadPdf() {
    console.log("loadPdf");
    const loadingDocument = pdfjsLib.getDocument(this.RENDER_OPTIONS.pdfDocument);
    loadingDocument.promise.then((pdf) => {
      this.RENDER_OPTIONS.pdfDocument = pdf;
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

  loadConfiguration() {
    console.log("loadAdapter");
    this.RENDER_OPTIONS = {
      documentId: 2,
      pdfDocument: this.file,
      scale: 1,
      rotate: 0
    };
    // pdfjsLib.GlobalWorkerOptions.workerSrc = workerURL;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';
  }

  loadAdapter() {
    console.log("loadAdapter");
    const { UI } = PDFJSAnnotate;
    const VIEWER = document.getElementById('viewer');
    const myAdapter = new MyAdapter();
    PDFJSAnnotate.setStoreAdapter(myAdapter);
    // PDFJSAnnotate.setStoreAdapter(PDFJSAnnotate.LocalStoreAdapter);
    this.UI = UI;
    this.viewer = VIEWER;
    this.adapter = myAdapter;
  }

  async handleFileDownload(url) {
    let response = await fetch(url);
    let data = await response.blob();
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      this.file = new Uint8Array(event.target.result);
      this.loadAdapter();
      this.loadConfiguration();
      this.loadPdf();
    };
    fileReader.readAsArrayBuffer(data);
  }

  handleFileInput = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      this.file = new Uint8Array(event.target.result);
      this.loadAdapter();
      this.loadConfiguration();
      this.loadPdf();
    };
    fileReader.readAsArrayBuffer(file);
  }

  // TODO: setup endpoint to get submission file from canvas
  getSubmission = (url) => {
    store.dispatch(submissionActions.getSubmission(url));
    return new Promise((resolve, reject) => {
      store.subscribe(() => {
        const { submission, error } = store.getState().submission;
        if (submission) {
          resolve(submission);
        } else {
          reject(error);
        }
      });
    });
  }

  getLastSubmission = () => {
    store.dispatch(submissionActions.getLastSubmission('37209'));
    return new Promise((resolve, reject) => {
      store.subscribe(() => {
        const { submission, error } = store.getState().submission;
        if (submission) {
          resolve(submission);
        } else {
          reject(error);
        }
      });
    });
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
            RENDER_OPTIONS={this.RENDER_OPTIONS}
            handleRerender={this.handleRerender}
            handleFullScreen={this.handleFullScreen}
          />
          <div className="toolbar" />
          <input
            type="file"
            onChange={this.handleFileInput}
          />
        <div id="viewer" className="pdfViewer" />
        </FullScreen>
      </div>
    );
  }
}

export default connect(select)(Docviewer);
