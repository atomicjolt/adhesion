import React from 'react';
import RadioButton from './radio_button';

export default class SizePicker extends React.Component {

  render() {
    const { tool, SIZES, activeSize } = this.props
    return (
      <div className="size-picker">
        <div className="secondary-toolbar_label">{tool === 'text' ? 'Size' : 'Line'}</div>
        { SIZES.map((size, id) => (
          <div key={id}>
            <RadioButton
              icon={tool === 'text' ? 'title' : 'brush'}
              color="blue"
              iconSize={size.iconSize}
              isActive={size === activeSize}
              onClick={() => this.props.choseSize(size)}
              tool={tool}
            />
          </div>
        ))}
      </div>
    );
  }
}
