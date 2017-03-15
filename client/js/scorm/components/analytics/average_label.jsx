import React  from 'react';

export default function AverageLabel(props) {
  return (
    <div className="c-aa-label">
      {props.label}: {props.data}
    </div>
  );
}

AverageLabel.propTypes = {
  label: React.PropTypes.string,
  data: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]),
};
