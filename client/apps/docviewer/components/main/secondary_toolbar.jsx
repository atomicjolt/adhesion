import React from 'react';
import PropTypes from 'prop-types';
import ColorPicker from './color_picker';
import SizePicker from './size_picker';

export default class SecondaryToolbar extends React.Component {
  constructor() {
    super();
    this.brushSizes = [
      { size: 1, iconSize: 'md-18' },
      { size: 5, iconSize: 'md-24' },
      { size: 8, iconSize: 'md-30' }
    ];
    this.textSizes = [
      { size: 5, iconSize: 'md-18' },
      { size: 12, iconSize: 'md-24' },
      { size: 18, iconSize: 'md-30' }
    ];
    this.state = {
      activeBrushSize: this.brushSizes[0],
      activeTextSize: this.textSizes[0],
      color: 'EE0512',
      highlightColor: 'FF999A'
    };
  }

  componentDidMount() {
    const { UI } = this.props;
    const {
      activeTextSize,
      activeBrushSize,
      color,
      highlightColor
    } = this.state;

    UI.setText(activeTextSize.size, color);
    UI.setPen(activeBrushSize.size, color);
    UI.setHighlight(highlightColor);
    UI.setStrikeout(color);
    UI.setArea(color);
  }

  choseColor = (color) => {
    const { UI, tool } = this.props;
    const { activeTextSize, activeBrushSize } = this.state;

    switch (tool) {
      case 'point':
        // TODO: PDFAnnotate does not support other point colors
        this.setState({ color });
        break;
      case 'highlight':
        this.setState({ highlightColor: color }, () => {
          UI.setHighlight(color);
        });
        break;
      case 'text':
        this.setState({ color }, () => {
          UI.setText(activeTextSize.size, color);
        });
        break;
      case 'strikeout':
        this.setState({ color }, () => {
          UI.setStrikeout(color);
        });
        break;
      case 'brush':
        this.setState({ color }, () => {
          UI.setPen(activeBrushSize.size, color);
        });
        break;
      case 'area':
        this.setState({ color }, () => {
          UI.setArea(color);
        });
        break;
      default:
        break;
    }
  }

  choseSize = (size) => {
    const { UI, tool } = this.props;
    const {
      color
    } = this.state;

    switch (tool) {
      case 'text':
        this.setState({ activeTextSize: size }, () => {
          UI.setText(size.size, color);
        });
        break;
      case 'brush':
        this.setState({ activeBrushSize: size }, () => {
          UI.setPen(size.size, color);
        });
        break;
      default:
        break;
    }
  }

  render() {
    const { tool } = this.props;
    const {
      activeTextSize,
      activeBrushSize,
      color,
      highlightColor
    } = this.state;

    return (
      <div className="secondary-toolbar">
        <ColorPicker
          tool={tool}
          choseColor={this.choseColor}
          activeColor={tool === 'highlight' ? highlightColor : color}
        />
        { tool === 'text'
          && <SizePicker
            tool={tool}
            choseSize={this.choseSize}
            SIZES={this.textSizes}
            activeSize={tool === 'text' ? activeTextSize : activeBrushSize}
          />}
        { tool === 'brush'
          && <SizePicker
            tool={tool}
            choseSize={this.choseSize}
            SIZES={this.brushSizes}
            activeSize={activeBrushSize}
          />}
      </div>
    );
  }
}

SecondaryToolbar.propTypes = {
  UI: PropTypes.object,
  tool: PropTypes.string
};
