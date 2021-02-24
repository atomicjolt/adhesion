import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { broadcastRawMessage } from 'atomic-fuel/libs/communications/communicator';
import ToolButton from '../common/tool_button';

export class DocumentControls extends React.Component {
  constructor() {
    super();
    this.state = {
      fullscreen: false
    };
  }

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

  enableFullscreen = () => {
    this.setState({ fullscreen: true });
    broadcastRawMessage('{ "subject": "app.enableFullscreen" }');
  }

  closeFullscreen = () => {
    this.setState({ fullscreen: false });
    broadcastRawMessage('{ "subject": "app.disableFullscreen" }');
  }

  render() {
    const { annotations } = this.props;
    const { fullscreen } = this.state;
    return (
      <nav className="document-controls">
        <ToolButton
          disabled={annotations && annotations.length > 0}
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
        {!fullscreen
          && <ToolButton
            icon="open_in_full"
            onClick={this.enableFullscreen}
          />}
        {fullscreen
          && <ToolButton
            icon="close_fullscreen"
            onClick={this.closeFullscreen}
          />}
      </nav>
    );
  }
}
DocumentControls.propTypes = {
  RENDER_OPTIONS: PropTypes.object,
  handleRerender: PropTypes.func,
};

const select = (state) => ({
  annotations: state.annotations.annotations
});

export default connect(
  select,
)(DocumentControls);
