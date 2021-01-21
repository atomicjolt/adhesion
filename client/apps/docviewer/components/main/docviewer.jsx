import React from 'react';
import PDFJSAnnotate from 'pdf-annotate.js';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import MyAdapter from '../../libs/my_adapter';
import PrimaryToolbar from './primary_toolbar';

export default class Docviewer extends React.Component {
  constructor() {
    super();
    this.state = {
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

  handleFileInput = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const url = new Uint8Array(event.target.result);
      const renderOptions = {
        url,
        documentId: 1234,
        pdfDocument: null,
        scale: 1,
        rotate: 0
      };
      this.loadApp(renderOptions);
    };
    fileReader.readAsArrayBuffer(file);
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
    const { renderOptions } = this.state;
    return (
      <>
        <PrimaryToolbar
          UI={this.UI}
          RENDER_OPTIONS={renderOptions}
          handleRerender={this.handleRerender}
          handleFullScreen={this.handleFullScreen}
        />
        <div className="toolbar" />
        <input
          type="file"
          onChange={this.handleFileInput}
        />
        <div id="viewer" className="pdfViewer" />
      </>
    );
  }
}
