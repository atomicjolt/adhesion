import React from 'react';
import Datepicker from 'react-datepicker';

export default function (props) {
  return (
    <div className="c-date-calendar" onClick={e => e.stopPropagation()}>
      <Datepicker {...props} />
    </div>
  );
}
