import React  from 'react';
import moment from 'moment';

export default function AnalyticRow(props) {

  function formatScore(score) {
    if (score || score === 0) {
      return `${score * 100}%`;
    }
    return 'N/A';
  }

  function formatTime(time) {
    const format = moment(time, 'HH:mm:ss');
    return (format.hours() * 60) + format.minutes();
  }

  return (
    <tr
      className="c-aa-row"
      onClick={ () => props.switchTable(props.id) }>
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
  time: React.PropTypes.string,
};
