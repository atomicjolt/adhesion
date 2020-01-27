import React from 'react';
import PropTypes from 'prop-types';
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
  scores: PropTypes.array,
};
