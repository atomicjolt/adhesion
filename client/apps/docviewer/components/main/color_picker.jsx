import React from 'react';

export default class ColorPicker extends React.Component {
  render() {
    const { tool } = this.props;
    const ALL_COLORS = [
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
    const HIGHLIGHT_COLORS = [
      'FF999A',
      'FFC067',
      'FCE680',
      '99EBA4',
      '81D0FF',
      'FFB9F1',
    ];
    const COLORS = tool === 'highlight' ? HIGHLIGHT_COLORS : ALL_COLORS;

    return (
      <div className="color-picker">
        <div className="secondary-toolbar_label">Color</div>
        { COLORS.map((color, id) => (
          <div key={id}>
            <button
              type="submit"
              role="radio"
              className="color-picker_button"
              aria-checked={this.props.activeColor === color}
              onClick={() => this.props.choseColor(color)}
            >
              <div className="color-picker_button-inner">
                <svg style={{ width: '27px', height: '27px' }}>
                  <circle className="ColorButton-selection-circle" cx="13.5" cy="13.5" r="11.5" strokeWidth="2.5" fill="none"></circle>
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
