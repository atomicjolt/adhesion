import React from 'react';
import ColorPicker from './color_picker';
import ToolButton from './tool_button';
import DocumentControls from './document_controls';
import AnnotationControls from './annotation_controls';

export default class Toolbar extends React.Component {
  constructor() {
    super();
    this.showSecondary = false;
  }

  toggleSecondary = () => {
    this.showSecondary = !this.showSecondary;
  }

  render() {
    return (
      <nav className="primary-toolbar">
        <div className="primary-controls">
          <div className="primary-controls_download">
            <ToolButton icon="save_alt" />
            <div className="primary-controls_divider" />
          </div>
          <DocumentControls />
          <AnnotationControls />
        </div>
        {
          this.showSecondary &&
          <div className="secondary-controls">
            <ColorPicker />
          </div>
        }
      </nav>
    );
  }
}
