import React          from 'react';
import AverageLabel   from './score_label';

export default function AverageScore(props) {
  return (
    <div>
      {
        props.scores.map(score =>
          <AverageLabel
            key={`scores_${score.name}`}
            label={score.name}
            data={score.value}
          />
        )
      }
    </div>
  );
}

AverageScore.propTypes = {
  scores: React.PropTypes.array,
};
