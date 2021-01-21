import React from 'react';
import PropTypes from 'prop-types';
import RadioButton from '../common/radio_button';

export default class AnnotationControls extends React.Component {
  constructor() {
    super();
    this.ANNOTATION_TOOLS = [
      { tool: 'selection', icon: 'near_me' },
      { tool: 'point', icon: 'push_pin' },
      { tool: 'highlight', icon: 'border_color' },
      { tool: 'text', icon: 'title' },
      { tool: 'strikeout', icon: 'strikethrough_s' },
      { tool: 'brush', icon: 'brush' },
      { tool: 'area', icon: 'highlight_alt' },
    ];
    this.state = {
      tool: null,
    };
  }

  disableTools() {
    const { UI, toggleSecondary } = this.props;
    UI.disableEdit();
    UI.disablePen();
    UI.disablePoint();
    UI.disableRect();
    UI.disableText();
    toggleSecondary();
  }

  handleToolSelection(tool) {
    const { UI, toggleSecondary } = this.props;
    this.setState({ tool });
    if (UI !== null) {
      this.disableTools();

      switch (tool) {
        case 'selection':
          UI.enableEdit();
          break;
        case 'point':
          toggleSecondary(tool);
          UI.enablePoint();
          break;
        case 'highlight':
          toggleSecondary(tool);
          UI.enableRect('highlight');
          break;
        case 'text':
          toggleSecondary(tool);
          UI.enableText();
          break;
        case 'strikeout':
          toggleSecondary(tool);
          UI.enableRect('strikeout');
          break;
        case 'brush':
          toggleSecondary(tool);
          UI.enablePen();
          break;
        case 'area':
          toggleSecondary(tool);
          UI.enableRect('area');
          break;
        default:
          break;
      }
    }
  }

  render() {
    const { tool } = this.state;
    return (
      <nav className="annotation-controls">
        <svg viewBox="0 0 2 26" className="primary-controls_divider">
          <line stroke="currentColor" strokeDasharray="2, 1" strokeWidth="1" x1="1" y1="0" x2="1" y2="26" />
        </svg>
        { this.ANNOTATION_TOOLS.map((curTool) => (
          <RadioButton
            key={curTool.tool}
            icon={curTool.icon}
            isActive={tool === curTool.tool}
            tool={curTool.tool}
            onClick={() => this.handleToolSelection(curTool.tool)}
          />
        ))}
      </nav>
    );
  }
}

AnnotationControls.propTypes = {
  UI: PropTypes.object,
  toggleSecondary: PropTypes.func
};
