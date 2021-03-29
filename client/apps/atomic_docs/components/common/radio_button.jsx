import React from 'react';
import PropTypes from 'prop-types';

export default class RadioButton extends React.Component {
  render() {
    const {
      tool,
      onClick,
      icon,
      iconSize,
      color,
      isActive,
    } = this.props;
    const iconColor = color ? `icon-${color}` : 'icon-white';

    return (
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
    );
  }
}

RadioButton.propTypes = {
  tool: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  iconSize: PropTypes.string,
  color: PropTypes.string,
  isActive: PropTypes.bool,
};
