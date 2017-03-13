import React  from 'react';
import moment from 'moment';

export default function registrationDetail(props) {

  function formatScore(score) {
    if (score || score == 0) return `${score * 100}%`;
    return 'N/A';
  }

  function formatTime(time) {
    const format = moment(time, 'HH:mm:ss');
    return (format.hours() * 60) + format.minutes();
  }

  return (
    <tr>
      <td>{ props.name }</td>
      <td>{ props.passed }</td>
      <td>{ formatScore(props.score) }</td>
      <td>{ formatTime(props.time) }</td>
    </tr>
  );
}

registrationDetail.propTypes = {
  name: React.PropTypes.string.isRequired,
  passed: React.PropTypes.string.isRequired,
  score: React.PropTypes.number,
  time: React.PropTypes.string,
};
