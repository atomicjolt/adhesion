import React from 'react';
import PropTypes from 'prop-types';
import PDFJSAnnotate from 'pdf-annotate.js';
import { connect } from 'react-redux';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import MyAdapter from './MyAdapter';
import Toolbar from './toolbar';
import workerURL from "../../pdf.worker.min.data";
import store from '../../app';
import * as submissionActions from '../../actions/submissions';

// import render from './renderer';
const select = (state) => ({
  annotation: state.annotation,
  annotations: state.annotations,
  comment: state.comment,
});

export class Docviewer extends React.Component {
  constructor() {
    super();
    this.UI = null;
    this.RENDER_OPTIONS = {};
    this.PAGE_HEIGHT = null;
    this.adapter = null;
    this.file = null;
    this.viewer = null;
    this.rendered = false;
  }

  componentDidMount() {
    console.log("MOUNTED");
    // this.getSubmission();
  }

  pdfRender = () => {
    if (this.rendered === false) return;
    const loadingDocument = pdfjsLib.getDocument(this.RENDER_OPTIONS.pdfDocument);
    loadingDocument.promise.then((pdf) => {
      console.log("pdf", pdf);
      this.RENDER_OPTIONS.pdfDocument = pdf;
      this.viewer.innerHTML = '';

      for (let i = 0; i < pdf.numPages; i += 1) {
        const page = this.UI.createPage(i + 1);
        this.viewer.appendChild(page);
      }
      this.viewer.appendChild(this.UI.createPage(1));
      window.pdfjsViewer = pdfjsViewer;
      this.UI.renderPage(1, this.RENDER_OPTIONS).then(([pdfPage, annotations]) => {
        console.log("pdfPage", pdfPage);
        console.log("annotations", annotations);
        const viewport = pdfPage.getViewport({
          scale: this.RENDER_OPTIONS.scale,
          rotation: this.RENDER_OPTIONS.rotate,
        });
        console.log("viewport", viewport);
        this.PAGE_HEIGHT = viewport.height;
        this.rendered = true;
      });
    });
  }

  loadConfiguration() {
    this.RENDER_OPTIONS = {
      documentId: '12345678',
      pdfDocument: this.file,
      scale: 1,
      rotate: 0
    };
    // pdfjsLib.GlobalWorkerOptions.workerSrc = workerURL;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';
    this.rendered = true;
    this.UI.enableEdit();
  }

  loadAdapter() {
    const { UI } = PDFJSAnnotate;
    const VIEWER = document.getElementById('viewer');
    const myAdapter = new MyAdapter();
    PDFJSAnnotate.setStoreAdapter(myAdapter);
    // PDFJSAnnotate.setStoreAdapter(PDFJSAnnotate.LocalStoreAdapter);
    this.UI = UI;
    this.viewer = VIEWER;
    this.adapter = myAdapter;
  }

  handleFileInput = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      this.file = new Uint8Array(event.target.result);
      this.loadAdapter();
      this.loadConfiguration();
      this.pdfRender();
    };
    fileReader.readAsArrayBuffer(file);
  }

  enablePen = () => {
    this.UI.setPen(12, '#4ef542')
    this.UI.enablePen();
  }

  disablePen = () => {
    this.UI.disablePen();
  }

  getSubmission = () => {
    store.dispatch(submissionActions.getSubmission('1234'));
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

  getAnnotationsHandler(documentId, pageNumber) {
    this.adapter.getAnnotations(documentId, pageNumber).then((data) => {
      console.log("data: ", data);
    }, (error) => {
      console.log("error: ", error);
    });
  }

  getAnnotationHandler(documentId, annotationId) {
    this.adapter.getAnnotation(documentId, annotationId).then((data) => {
      console.log("data: ", data);
    }, (error) => {
      console.log("error: ", error);
    });
  }

  addAnnotationHandler(documentId, pageNumber, annotation) {
    this.adapter.addAnnotation(documentId, pageNumber, annotation).then((data) => {
      console.log("data: ", data);
    }, (error) => {
      console.log("error: ", error);
    });
  }

  editAnnotationHandler(documentId, pageNumber, annotation) {
    this.adapter.editAnnotation(documentId, pageNumber, annotation).then((data) => {
      console.log("data: ", data);
    }, (error) => {
      console.log("error: ", error);
    });
  }

  deleteAnnotationHandler(documentId, annotationId) {
    this.adapter.deleteAnnotation(documentId, annotationId).then((data) => {
      console.log("data: ", data);
    }, (error) => {
      console.log("error: ", error);
    });
  }

  addCommentHandler(documentId, annotationId, content) {
    this.adapter.addComment(documentId, annotationId, content).then((data) => {
      console.log("data: ", data);
    }, (error) => {
      console.log("error: ", error);
    });
  }

  deleteCommentHandler(documentId, commentId) {
    this.adapter.deleteComment(documentId, commentId).then((data) => {
      console.log("data: ", data);
    }, (error) => {
      console.log("error: ", error);
    });
  }

  render() {
    const showTests = false;
    const viewerStyle = {
      position: 'relative',
    };
    return (
      <div>
        <Toolbar />
        <div className="toolbar" />
        <input
          type="file"
          onChange={this.handleFileInput}
        />
        <button
          type="submit"
          className="deleteCommentButton"
          onClick={() => this.enablePen()}
        >
          ENABLE PEN
        </button>
        <button
          type="submit"
          className="deleteCommentButton"
          onClick={()=> this.disablePen()}
        >
          DISABLE PEN
        </button>
        <div id="viewer" style={viewerStyle}>
        </div>
      </div>
    );
  }
}

export default connect(select)(Docviewer);
