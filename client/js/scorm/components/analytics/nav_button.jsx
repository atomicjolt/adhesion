import React  from 'react';

export default function NavButton(props) {
  var active = props.activeBtn == props.label ? 'is-active' : '';
  return (
    <button
      className={ `c-aa-graph-nav__item ${ active }` }
      onClick={ () => props.setActive(props.label) }>
      <span className="c-aa-stat">{ props.stat || 0 }%</span>
      <span className="c-aa-label">{ props.label }</span>
    </button>
  );
}
