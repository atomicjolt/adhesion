import React from 'react';
import PropTypes from 'prop-types';
import ToolButton from './tool_button';
import SecondaryToolbar from './secondary_toolbar';
import DocumentControls from './document_controls';
import AnnotationControls from './annotation_controls';


export default class PrimaryToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSecondary: false,
      tool: null,
    }
  }

  toggleSecondary = (tool) => {
    if (tool) {
      this.setState({ showSecondary: true, tool })
    } else {
      this.setState({ showSecondary: false, tool })
    }
  }

  render() {
    const { showSecondary } = this.state;
    return (
      <nav className="primary-toolbar">
        <div
          className="primary-controls"
          role="toolbar"
          aria-label="pdf annotation tools"
          aria-controls="viewer"
        >
          <div className="primary-controls_download">
            <ToolButton icon="save_alt" />
            <svg viewBox="0 0 2 26" className="primary-controls_divider">
              <line stroke="currentColor" strokeDasharray="2, 1" strokeWidth="1" x1="1" y1="0" x2="1" y2="26" />
            </svg>
          </div>
          <DocumentControls
            RENDER_OPTIONS={this.props.RENDER_OPTIONS}
            handleRerender={this.props.handleRerender}
            handleFullScreen={this.props.handleFullScreen}
          />
          <AnnotationControls
            UI={this.props.UI}
            toggleSecondary={this.toggleSecondary}
          />
        </div>
        {
          showSecondary && <SecondaryToolbar UI={this.props.UI} tool={this.state.tool} />
        }
      </nav>
    );
  }
}

PrimaryToolbar.propTypes = {
  UI: PropTypes.object,
  RENDER_OPTIONS: PropTypes.object,
};
