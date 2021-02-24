import React from 'react';
import PropTypes from 'prop-types';
import ToolButton from '../common/tool_button';
import SecondaryToolbar from './secondary_toolbar';
import DocumentControls from './document_controls';
import AnnotationControls from './annotation_controls';

export default class PrimaryToolbar extends React.Component {
  constructor() {
    super();
    this.state = {
      tool: null,
    };
  }

  toggleSecondary = (tool) => {
    const { toggleSecondary } = this.props;
    toggleSecondary(tool);
    this.setState({ tool });
  }

  render() {
    const { tool } = this.state;
    const { showSecondary } = this.props;
    // TODO: export button is hidden until implemented
    const showExportButton = false;
    const {
      UI,
      RENDER_OPTIONS,
      handleRerender,
    } = this.props;
    return (
      <nav className="primary-toolbar">
        <div
          className="primary-controls"
          role="toolbar"
          aria-label="pdf annotation tools"
          aria-controls="viewer"
        >
          <div className="primary-controls_download">
            { showExportButton && <ToolButton icon="save_alt" />}
            { showExportButton && <svg viewBox="0 0 2 26" className="primary-controls_divider">
                <line stroke="currentColor" strokeDasharray="2, 1" strokeWidth="1" x1="1" y1="0" x2="1" y2="26" />
              </svg>
            }
          </div>
          <DocumentControls
            RENDER_OPTIONS={RENDER_OPTIONS}
            handleRerender={handleRerender}
          />
          <AnnotationControls
            UI={UI}
            toggleSecondary={this.toggleSecondary}
          />
        </div>
        { showSecondary && <SecondaryToolbar UI={UI} tool={tool} /> }
      </nav>
    );
  }
}

PrimaryToolbar.propTypes = {
  UI: PropTypes.object,
  RENDER_OPTIONS: PropTypes.object,
  handleRerender: PropTypes.func,
  handleFullScreen: PropTypes.func,
  toggleSecondary: PropTypes.func,
  showSecondary: PropTypes.bool,
};
