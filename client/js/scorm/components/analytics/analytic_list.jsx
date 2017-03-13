import React              from 'react';
import _                  from 'lodash';
import AnalyticRow        from './analytic_row';

export default function registrationList(props) {

  return (
    <table className="c-aa-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Passed</th>
          <th>Score</th>
          <th>AVG Time(mins)</th>
        </tr>
      </thead>
      <tbody>
        {
          _.map(props.regList, (reg, key) => (
            <AnalyticRow
              key={key}
              name={reg.name}
              passed={reg.passed}
              score={reg.score}
              time={reg.time}
            />
          ))
        }
      </tbody>
    </table>
  );
}

registrationList.propTypes = {
  regList: React.PropTypes.shape({}),
};
