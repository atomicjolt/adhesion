import React from 'react';
import PropTypes from 'prop-types';
import ToolButton from './tool_button';

export default class DocumentControls extends React.Component {
  constructor(props) {
    super(props);
    this.RENDER_OPTIONS = null;
    this.rendered = null;
    this.fullScreenMode = false;
    // TODO aria label keep tool in state
  }

  componentDidUpdate(prevProps) {
    // console.log("updated RENDER_OPTIONS: ", this.props.RENDER_OPTIONS);
    if (prevProps !== this.props) {
      const { RENDER_OPTIONS, handleRerender, handleFullScreen } = this.props;
      this.RENDER_OPTIONS = RENDER_OPTIONS;
      this.handleRerender = handleRerender;
      this.handleFullScreen = handleFullScreen;
    }
  }

  rotate = () => {
    this.RENDER_OPTIONS.rotate -= 90;
    this.handleRerender();
  }

  zoomOut = () => {
    this.RENDER_OPTIONS.scale -= 0.1;
    this.handleRerender();
  }

  zoomIn = () => {
    this.RENDER_OPTIONS.scale += 0.1;
    this.handleRerender();
  }

  fullScreen = () => {
    this.handleFullScreen();
  }

  render() {
    return (
      <nav className="document-controls">
        <ToolButton
          icon="rotate_90_degrees_ccw"
          onClick={this.rotate}
        />
        <svg viewBox="0 0 2 26" className="primary-controls_divider">
          <line stroke="currentColor" strokeDasharray="2, 1" strokeWidth="1" x1="1" y1="0" x2="1" y2="26" />
        </svg>
        <ToolButton
          icon="remove"
          onClick={this.zoomOut}
        />
        <span className="document-controls_zoom">Zoom</span>
        <ToolButton
          icon="add"
          onClick={this.zoomIn}
        />
        <svg viewBox="0 0 2 26" className="primary-controls_divider">
          <line stroke="currentColor" strokeDasharray="2, 1" strokeWidth="1" x1="1" y1="0" x2="1" y2="26" />
        </svg>
        <ToolButton
          icon="open_in_full"
          onClick={this.fullScreen}
        />
      </nav>
    );
  }
}
DocumentControls.propTypes = {
  RENDER_OPTIONS: PropTypes.object,
  handleRerender: PropTypes.func,
  handleFullScreen: PropTypes.func
};
