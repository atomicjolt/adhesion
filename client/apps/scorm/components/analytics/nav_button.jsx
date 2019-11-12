import React from 'react';
import PropTypes from 'prop-types';

export default function NavButton(props) {
  const active = props.activeBtn === props.label ? 'is-active' : '';
  return (
    <button
      className={`c-aa-graph-nav__item ${active}`}
      onClick={() => props.setActive(props.type)}
    >
      <span className="c-aa-stat">{props.stat}</span>
      <span className="c-aa-label">{props.label}</span>
    </button>
  );
}

NavButton.propTypes = {
  activeBtn: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  setActive: PropTypes.func.isRequired,
  stat: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};
