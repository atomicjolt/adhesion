import React from 'react';
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
  type: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  className: React.PropTypes.string,
  ariaLabel: React.PropTypes.string,
  noIconClass: React.PropTypes.bool,
  children: React.PropTypes.node,
  onBlur: React.PropTypes.func,
};
