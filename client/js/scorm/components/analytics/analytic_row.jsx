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

  var styles = {};
  if(props.id) {
    styles = {
      cursor: 'pointer',
    };
  }

  return (
    <tr
      className="c-aa-row"
      onClick={() => props.switchTable(props.id)}
      style={styles}
    >
      <td>{props.name || 'Unknown'}</td>
      <td>{props.passed}</td>
      <td>{formatScore(props.score)}</td>
      <td>{formatTime(props.time)}</td>
    </tr>
  );
}

AnalyticRow.propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  passed: React.PropTypes.string.isRequired,
  score: React.PropTypes.number,
  time: React.PropTypes.number,
  switchTable: React.PropTypes.func.isRequired,
};
