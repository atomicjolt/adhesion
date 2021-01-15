import React from 'react';

export default class ToolButton extends React.Component {
  render() {
    const {
      onClick,
      icon,
      color,
      size,
      isActive,
      tool
    } = this.props;
    const iconColor = color ? `icon-${color}` : 'icon-white';
    // TODO disabled for rotate
    const disabled = false;
    return (
      <>
        <button
          type="button"
          aria-disabled={disabled}
          aria-pressed={isActive}
          aria-label={tool}
          tabIndex="-1"
          className={`tool-button ${iconColor} `}
          onClick={onClick}
        >
          <i className={`material-icons ${size}`} aria-hidden>{icon}</i>
        </button>
      </>
    );
  }
}
