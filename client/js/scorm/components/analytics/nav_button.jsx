import React  from 'react';

export default function NavButton(props) {
  const active = props.activeBtn === props.label ? 'is-active' : '';
  return (
    <button
      className={`c-aa-graph-nav__item ${active}`}
      onClick={() => props.setActive(props.label)}
    >
      <span className="c-aa-stat">{props.stat}</span>
      <span className="c-aa-label">{props.label}</span>
    </button>
  );
}

NavButton.propTypes = {
  activeBtn: React.PropTypes.string,
  label: React.PropTypes.string,
  setActive: React.PropTypes.func.isRequired,
  stat: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]),
};
