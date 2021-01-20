import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ToolButton from '../common/tool_button';

export class DocumentControls extends React.Component {
  rotate = () => {
    const { RENDER_OPTIONS, handleRerender } = this.props;
    RENDER_OPTIONS.rotate -= 90;
    handleRerender();
  }

  zoomOut = () => {
    const { RENDER_OPTIONS, handleRerender } = this.props;
    RENDER_OPTIONS.scale -= 0.1;
    handleRerender();
  }

  zoomIn = () => {
    const { RENDER_OPTIONS, handleRerender } = this.props;
    RENDER_OPTIONS.scale += 0.1;
    handleRerender();
  }

  fullScreen = () => {
    const { handleFullScreen } = this.props;
    handleFullScreen();
  }

  render() {
    const { annotations } = this.props;
    return (
      <nav className="document-controls">
        <ToolButton
          disabled={annotations.length >= 0}
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

const select = (state) => ({
  annotations: state.annotations.annotations
});

export default connect(
  select,
)(DocumentControls);
