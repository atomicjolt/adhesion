import React from 'react';
import _ from 'lodash';

export default function NavButton(props) {
  const active = props.activeBtn === _.snakeCase(props.label) ? 'is-active' : '';
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
  activeBtn: React.PropTypes.string,
  label: React.PropTypes.string,
  type: React.PropTypes.string,
  setActive: React.PropTypes.func.isRequired,
  stat: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]),
};
