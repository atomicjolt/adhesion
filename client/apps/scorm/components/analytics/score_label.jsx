import React from 'react';

export default function ScoreLabel(props) {
  return (
    <div className="c-aa-label">
      {props.name}: {props.value}
    </div>
  );
}

ScoreLabel.propTypes = {
  name: React.PropTypes.string,
  value: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]),
};
