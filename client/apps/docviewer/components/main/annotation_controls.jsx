import React from 'react';
import PropTypes from 'prop-types';
import RadioButton from './radio_button';

export default class AnnotationControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tool: null,
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      // console.log("componentDidUpdate this.props: ", this.props);
      this.UI = this.props.UI;
      this.toggleSecondary = this.props.toggleSecondary;
    }
  }

  disableTools() {
    this.UI.disableEdit();
    this.UI.disablePen();
    this.UI.disablePoint();
    this.UI.disableRect();
    this.UI.disableText();
    this.props.toggleSecondary();
  }

  handleToolSelection(tool) {
    this.setState({ tool });
    if (this.UI !== null) {
      this.disableTools();

      switch (tool) {
        case 'selection':
          this.UI.enableEdit();
          break;
        case 'point':
          this.props.toggleSecondary(tool);
          this.UI.enablePoint();
          break;
        case 'highlight':
          this.props.toggleSecondary(tool);
          this.UI.enableRect('highlight');
          break;
        case 'text':
          this.props.toggleSecondary(tool);
          this.UI.enableText();
          break;
        case 'strikeout':
          this.props.toggleSecondary(tool);
          this.UI.enableRect('strikeout');
          break;
        case 'brush':
          this.props.toggleSecondary(tool);
          this.UI.enablePen();
          break;
        case 'area':
          this.props.toggleSecondary(tool);
          this.UI.enableRect('area');
          break;
        default:
          console.log("Error: invalid tool selection");
      }
    }
  }

  render() {
    return (
      <nav className="annotation-controls">
        <svg viewBox="0 0 2 26" className="primary-controls_divider">
          <line stroke="currentColor" strokeDasharray="2, 1" strokeWidth="1" x1="1" y1="0" x2="1" y2="26" />
        </svg>
        <RadioButton
          icon="near_me"
          isActive={this.state.tool === 'selection'}
          tool="selection"
          onClick={() => this.handleToolSelection('selection')}
        />
        <RadioButton
          icon="push_pin"
          isActive={this.state.tool === 'point'}
          tool="point"
          onClick={() => this.handleToolSelection('point')}
        />
        <RadioButton
          icon="border_color"
          isActive={this.state.tool === 'highlight'}
          tool="highlight"
          onClick={() => this.handleToolSelection('highlight')}
        />
        <RadioButton
          icon="title"
          isActive={this.state.tool === 'text'}
          tool="text"
          onClick={() => this.handleToolSelection('text')}
        />
        <RadioButton
          icon="strikethrough_s"
          isActive={this.state.tool === 'strikeout'}
          tool="strikeout"
          onClick={() => this.handleToolSelection('strikeout')}
        />
        <RadioButton
          icon="brush"
          isActive={this.state.tool === 'brush'}
          tool="brush"
          onClick={() => this.handleToolSelection('brush')}
        />
        <RadioButton
          icon="highlight_alt"
          isActive={this.state.tool === 'area'}
          tool="area"
          onClick={() => this.handleToolSelection('area')}
        />
      </nav>
    );
  }
}
AnnotationControls.propTypes = {
  UI: PropTypes.object,
  toggleSecondary: PropTypes.func
};
