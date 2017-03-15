import React          from 'react';
import AverageLabel   from './average_label';

export default function AverageScore(props) {
  return (
    <div>
      <AverageLabel
        label="Mean Score"
        data={props.data.meanScore}
      />
      <AverageLabel
        label="Median Score"
        data={props.data.medScore}
      />
      <AverageLabel
        label="Lowest Score"
        data={props.data.lowScore}
      />
      <AverageLabel
        label="Highest Score"
        data={props.data.highScore}
      />
    </div>
  );
}

AverageScore.propTypes = {
  data: React.PropTypes.shape({
    meanScore: React.PropTypes.number,
    medScore: React.PropTypes.number,
    lowScore: React.PropTypes.number,
    highScore: React.PropTypes.number,
  })
};
