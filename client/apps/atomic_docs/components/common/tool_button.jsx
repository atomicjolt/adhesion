import React from 'react';
import PropTypes from 'prop-types';

export default class ToolButton extends React.Component {
  render() {
    const {
      tool,
      onClick,
      icon,
      color,
      size,
      isActive,
      disabled
    } = this.props;
    const iconColor = color ? `icon-${color}` : 'icon-white';
    return (
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
    );
  }
}

ToolButton.propTypes = {
  tool: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  isActive: PropTypes.bool,
  disabled: PropTypes.bool,
};
