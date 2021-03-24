import React from 'react';
import PropTypes from 'prop-types';
import RadioButton from '../common/radio_button';

export default class SizePicker extends React.Component {
  render() {
    const {
      tool,
      SIZES,
      activeSize,
      choseSize
    } = this.props;

    return (
      <div className="size-picker">
        <div className="secondary-toolbar_label">{tool === 'text' ? 'Size' : 'Line'}</div>
        { SIZES.map(size => (
          <div key={size.size}>
            <RadioButton
              icon={tool === 'text' ? 'title' : 'brush'}
              color="blue"
              iconSize={size.iconSize}
              isActive={size === activeSize}
              onClick={() => choseSize(size)}
              tool={tool}
            />
          </div>
        ))}
      </div>
    );
  }
}

SizePicker.propTypes = {
  tool: PropTypes.string,
  SIZES: PropTypes.array,
  activeSize: PropTypes.object,
  choseSize: PropTypes.func
};
