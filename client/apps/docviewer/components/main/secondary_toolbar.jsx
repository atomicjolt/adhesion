import React from 'react';
import PropTypes from 'prop-types';
import ColorPicker from './color_picker';
import SizePicker from './size_picker';


export default class SecondaryToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.brushSizes = [
      { size: 1, iconSize: 'md-18' },
      { size: 5, iconSize: 'md-24' },
      { size: 8, iconSize: 'md-30' }
    ];
    this.textSizes = [
      { size: 1, iconSize: 'md-18' },
      { size: 5, iconSize: 'md-24' },
      { size: 8, iconSize: 'md-30' }
    ];
    this.state = {
      activeBrushSize: this.brushSizes[0],
      activeTextSize: this.textSizes[0],
      color: 'EE0512'
    };
  }

  choseColor = (color) => {
    switch (this.props.tool) {
      case 'point':
        // TODO: PDFAnnotate does not support other point COLORS
        console.log("point choseColor: ", this.state.color);
        break;
      case 'highlight':
        // TODO: PDFAnnotate does not support other highlight COLORS
        console.log("highlight choseColor: ", this.state.color);
        break;
      case 'text':
        this.setState({ color }, () => {
          this.props.UI.setPen(this.state.activeTextSize.size, this.state.color);
        });
        break;
      case 'strikeout':
        // TODO: PDFAnnotate does not support other strikeout COLORS
        console.log("strikeout choseColor: ", this.state.color);
        break;
      case 'brush':
        this.setState({ color }, () => {
          console.log("this.state: ", this.state);
          this.props.UI.setPen(this.state.activeBrushSize.size, this.state.color);
        });
        break;
      case 'area':
        // TODO: PDFAnnotate does not support other area COLORS
        console.log("area choseColor: ", this.state.color);
        break;
      default:
        console.log("Error chosing color");
    }
  }

  choseSize = (size) => {
    switch (this.props.tool) {
      case 'text':
        this.setState({ activeTextSize: size }, () => {
          this.props.UI.setPen(this.state.activeTextSize.size, this.state.color);
        });
        break;
      case 'brush':
        this.setState({ activeBrushSize: size }, () => {
          this.props.UI.setPen(this.state.activeBrushSize.size, this.state.color);
        });
        break;
      default:
        console.log("Error chosing color");
    }
  }

  render() {
    const { tool } = this.props

    return (
      <div className="secondary-toolbar">
        <ColorPicker
          choseColor={this.choseColor}
          activeColor={this.state.color}
          tool={tool}
        />
        { tool === 'text' &&
          <SizePicker
            tool={tool}
            choseSize={this.choseSize}
            SIZES={this.textSizes}
            activeSize={this.state.activeTextSize}
          />}
        { tool === 'brush' &&
          <SizePicker
            tool={tool}
            choseSize={this.choseSize}
            SIZES={this.brushSizes}
            activeSize={this.state.activeBrushSize}
          />}
      </div>
    );
  }
}

SecondaryToolbar.propTypes = {
  UI: PropTypes.object,
  tool: PropTypes.string
};
