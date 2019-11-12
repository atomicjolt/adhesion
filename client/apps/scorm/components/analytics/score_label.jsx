import React from 'react';
import PropTypes from 'prop-types';

export default function ScoreLabel(props) {
  return (
    <div className="c-aa-label">
      {props.name}: {props.value}
    </div>
  );
}

ScoreLabel.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};
