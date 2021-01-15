import React from 'react';

export default class RadioButton extends React.Component {
  render() {
    const {
      icon,
      color,
      iconSize,
      isActive,
      onClick,
      tool
    } = this.props;
    const iconColor = color ? `icon-${color}` : 'icon-white';
    return (
      <>
        <button
          type="button"
          role="radio"
          aria-checked={isActive}
          tabIndex="-1"
          aria-label={tool}
          className={`tool-button ${iconColor} `}
          onClick={onClick}
        >
          <i className={`material-icons ${iconSize}`} aria-hidden>{icon}</i>
        </button>
      </>
    );
  }
}
