import React  from 'react';

export default function AverageLabel(props) {
  return (
    <div className="c-aa-label">
      { props.label }: { props.data }
    </div>
  );
}
