import React from 'react';
import PropTypes from 'prop-types';
import CommonSvg from './common_svg';

export default function svgButton(props) {
  const onClick = props.onClick || (() => {});
  const onBlur = props.onBlur || (() => {});
  return (
    <button
      className={props.className || 'c-icon-btn'}
      onClick={onClick}
      onBlur={onBlur}
      aria-label={props.ariaLabel}
    >
      {props.children}
      <CommonSvg className={props.noIconClass ? null : 'c-icon'} type={props.type} />
    </button>
  );
}

svgButton.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  noIconClass: PropTypes.bool,
  children: PropTypes.node,
  onBlur: PropTypes.func,
};
