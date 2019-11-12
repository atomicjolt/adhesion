import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ScoreLabel from './score_label';

export default function AverageScore(props) {
  return (
    <div>
      <ScoreLabel
        name="Mean Score"
        value={_.ceil(props.meanScore, 2)}
      />
      <ScoreLabel
        name="Median Score"
        value={_.ceil(props.medScore, 2)}
      />
      <ScoreLabel
        name="Lowest Score"
        value={_.ceil(props.lowScore, 2)}
      />
      <ScoreLabel
        name="Highest Score"
        value={_.ceil(props.highScore, 2)}
      />
    </div>
  );
}

AverageScore.propTypes = {
  meanScore: PropTypes.number,
  medScore: PropTypes.number,
  lowScore: PropTypes.number,
  highScore: PropTypes.number,
};
