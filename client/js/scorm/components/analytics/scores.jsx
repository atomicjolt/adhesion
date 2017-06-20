import React from 'react';
import ScoreLabel from './score_label';

export default function AverageScore(props) {

  const styles = {
    container: {
      position: 'absolute',
      top: '2rem',
      right: '5rem',
    },
  };

  return (
    <div style={styles.container}>
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
