import React from 'react';
import PropTypes from 'prop-types';
import PDFJSAnnotate from 'pdf-annotate.js';
import { connect } from 'react-redux';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import MyAdapter from './MyAdapter';
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
    this.adapter = null;
    this.file = null;
    this.viewer = null;
  }

  componentDidMount() {
    console.log("MOUNTED");
  }


  renderDocument() {
    this.RENDER_OPTIONS = {
      documentId: 12345678,
      document: this.file,
      pdfDocument: null,
      scale: 1,
      rotate: 0
    };
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerURL;
    const loadingDocument = pdfjsLib.getDocument(this.RENDER_OPTIONS.document);
    loadingDocument.promise.then((pdf) => {
      console.log("PDF Loaded!!");
      this.RENDER_OPTIONS.pdfDocument = pdf;
      this.viewer.appendChild(this.UI.createPage(1));
      window.pdfjsViewer = pdfjsViewer;
      this.UI.renderPage(1, this.RENDER_OPTIONS).then(([pdfPage, annotations]) => {
        console.log("pdfPage", pdfPage);
        console.log("annotations", annotations);
      });
    });
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

  enableUI() {
    this.UI.enableUI();
    this.UI.enableEdit();
  }

  handleFileInput = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      this.file = new Uint8Array(event.target.result);
      console.log("this.file: ", this.file);
      this.loadAdapter();
      this.renderDocument();
    };
    fileReader.readAsArrayBuffer(file);
  }

  pdfRender = () => {
    const loadingDocument = pdfjsLib.getDocument(this.RENDER_OPTIONS.pdfDocument);
    loadingDocument.promise.then((pdf) => {
      console.log("PDF Loaded!!");
    });
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
    return (
      <div>
        <div className="toolbar" />
        <input
          type="file"
          onChange={this.handleFileInput}
        />
        <button
          className="deleteCommentButton"
          onClick={()=> this.enablePen()}
        >
          ENABLE PEN
        </button>
        <button
          className="deleteCommentButton"
          onClick={()=> this.disablePen()}
        >
          DISABLE PEN
        </button>
        <div id="viewer">
          { showTests &&
            <div className="tests">
              <button
                className="getAnnotationsButton"
                onClick={()=> this.getAnnotationsHandler('1234', 1)}
              >
                GET ANNOTATIONS
              </button>
              <button
                className="getAnnotationButton"
                onClick={()=> this.getAnnotationHandler('1234', '12341234')}
              >
                GET ANNOTATION
              </button>
              <button
                className="addAnnotationsButton"
                onClick={
                  ()=> this.addAnnotationHandler( '1234', 1, { type: 'area', width: 100, height: 50, x: 250, y: 100, size: 10, color: "FF0000", content: "Hello world 2", rectangles: [ { "height": 75, "width": 150, "x": 19, "y": 37 } ] } ) } >
                ADD ANNOTATION
              </button>
              <button
                className="editAnnotationsButton"
                onClick={()=> this.editAnnotationHandler('1234', 1, { id: 11, type: 'HELLO', width: 20, height: 20, x: 20, y: 20 })}
              >
                EDIT ANNOTATION
              </button>
              <button
                className="deleteAnnotationsButton"
                onClick={()=> this.deleteAnnotationHandler('1234', 11)}
              >
                DELETE ANNOTATION
              </button>
              <button
                className="addCommentButton"
                onClick={()=> this.addCommentHandler('1234', 12, 'THIS IS A TEST')}
              >
                ADD COMMENT
              </button>
              <button
                className="deleteCommentButton"
                onClick={()=> this.deleteCommentHandler('1234', 2)}
              >
                DELETE COMMENT
              </button>
            </div>
           }
        </div>
      </div>
    );
  }
}

export default connect(select)(Docviewer);
