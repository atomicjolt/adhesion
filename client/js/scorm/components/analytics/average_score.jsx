import React          from 'react';
import _ from 'lodash';
import AverageLabel   from './average_label';

export default function AverageScore(props) {
  return (
    <div>
      <AverageLabel
        label="Mean Score"
        data={_.ceil(props.meanScore, 2)}
      />
      <AverageLabel
        label="Median Score"
        data={_.ceil(props.medScore, 2)}
      />
      <AverageLabel
        label="Lowest Score"
        data={_.ceil(props.lowScore, 2)}
      />
      <AverageLabel
        label="Highest Score"
        data={_.ceil(props.highScore, 2)}
      />
    </div>
  );
}

AverageScore.propTypes = {
  meanScore: React.PropTypes.number,
  medScore: React.PropTypes.number,
  lowScore: React.PropTypes.number,
  highScore: React.PropTypes.number,
};
