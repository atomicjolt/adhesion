import React      from 'react';
import Datepicker from 'react-datepicker';

export default class extends React.Component {
  render(){
    return (
      <div className="c-date-calendar" onClick={(e)=>e.stopPropagation()}>
        <Datepicker {...this.props} />
      </div>
    );
  }
}
