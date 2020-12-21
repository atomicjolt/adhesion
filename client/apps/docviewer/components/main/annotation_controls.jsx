import React from 'react';
import ToolButton from './tool_button';

export default class AnnotationControls extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <nav className="document-controls">
        <div className="primary-controls_divider" />
        <ToolButton icon="near_me" />
        <ToolButton icon="push_pin" />
        <ToolButton icon="border_color" />
        <ToolButton icon="title" />
        <ToolButton icon="strikethrough_s" />
        <ToolButton icon="brush" />
        <ToolButton icon="highlight_alt" />
      </nav>
    );
  }
}
