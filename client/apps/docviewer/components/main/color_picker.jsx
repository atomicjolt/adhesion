import React from 'react';
import PropTypes from 'prop-types';

export default class ColorPicker extends React.Component {
  constructor() {
    super();
    this.ALL_COLORS = [
      'EE0512',
      'FC5E13',
      'FCBA00',
      '8D6437',
      '07AC18',
      '224C9F',
      'C31FA8',
      '363636',
      '741765',
    ];
    this.HIGHLIGHT_COLORS = [
      'FF999A',
      'FFC067',
      'FCE680',
      '99EBA4',
      '81D0FF',
      'FFB9F1',
    ];
  }

  render() {
    const { tool, activeColor, choseColor } = this.props;
    const COLORS = tool === 'highlight' ? this.HIGHLIGHT_COLORS : this.ALL_COLORS;

    return (
      <div className="color-picker">
        <div className="secondary-toolbar_label">Color</div>
        { COLORS.map((color) => (
          <div key={color}>
            <button
              type="submit"
              role="radio"
              className="color-picker_button"
              aria-checked={activeColor === color}
              onClick={() => choseColor(color)}
            >
              <div className="color-picker_button-inner">
                <svg style={{ width: '27px', height: '27px' }}>
                  <circle className="ColorButton-selection-circle" cx="13.5" cy="13.5" r="11.5" strokeWidth="2.5" fill="none" />
                  <circle className="ColorButton-main-circle" cx="13.5" cy="13.5" r="8.5" fill={`#${color}`} />
                </svg>
              </div>
            </button>
          </div>
        ))}
      </div>
    );
  }
}

ColorPicker.propTypes = {
  tool: PropTypes.string,
  activeColor: PropTypes.string,
  choseColor: PropTypes.func
};
