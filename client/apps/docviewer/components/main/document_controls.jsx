import React from 'react';
import ToolButton from './tool_button';

export default class DocumentControls extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <nav className="document-controls">
        <ToolButton icon="rotate_90_degrees_ccw" />
        <div className="primary-controls_divider" />
        <ToolButton icon="remove" />
        <span className="document-controls_zoom">Zoom</span>
        <ToolButton icon="add" />
        <div className="primary-controls_divider" />
        <ToolButton icon="open_in_full" />
      </nav>
    );
  }
}
