import React from 'react';
import ScoreLabel from './score_label';

export default function AverageScore(props) {
  return (
    <div>
      {
        props.scores.map(score =>
          <ScoreLabel
            key={`scores_${score.name}`}
            name={score.name}
            value={score.value}
          />
        )
      }
    </div>
  );
}

AverageScore.propTypes = {
  scores: React.PropTypes.array,
};
