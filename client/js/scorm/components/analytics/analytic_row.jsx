import React  from 'react';
import _ from 'lodash';

export default function AnalyticRow(props) {

  function formatScore(score) {
    if (score || score === 0) {
      return `${score * 100}%`;
    }
    return 'N/A';
  }

  function formatTime(time) {
    return _.ceil(time / 60);
  }

  let rowStyles = {};
  let iconStyles = {};
  let firstColumnStyle = {};
  let tableClass = 'c-aa-row';
  let icon;
  if (props.depth) {
    const totalDepth = 2 * props.depth;
    const iconLeft = totalDepth + 1.3;
    const rowLeft = totalDepth + 4;
    iconStyles = {
      left: `${iconLeft}rem`,
    };
    firstColumnStyle = {
      paddingLeft: `${rowLeft}rem`,
    };
  }
  if (props.isParent || !(props.depth >= 0)) {
    rowStyles = {
      cursor: 'pointer',
    };
    if (props.isParent) {
      tableClass += ' c-aa-accordion is-open';
      icon = <i style={iconStyles} className="material-icons">arrow_drop_down</i>;
    }
  }

  return (
    <tr
      className={tableClass}
      onClick={() => props.switchTable(props.id)}
      style={rowStyles}
    >
      <td style={firstColumnStyle}>{icon}{props.name || 'Unknown'}</td>
      <td>{props.passed}</td>
      <td>{formatScore(props.score)}</td>
      <td>{formatTime(props.time)}</td>
    </tr>
  );
}

AnalyticRow.propTypes = {
  id: React.PropTypes.number,
  name: React.PropTypes.string,
  passed: React.PropTypes.string,
  score: React.PropTypes.number,
  time: React.PropTypes.number,
  isParent: React.PropTypes.bool,
  depth: React.PropTypes.number,
  switchTable: React.PropTypes.func.isRequired,
};
