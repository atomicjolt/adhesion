import React      from 'react';
import moment     from 'moment';
import Datepicker from './datepicker';

export default class DateSelector extends React.Component{

  static propTypes = {
    date: React.PropTypes.object.isRequired,
    updateDate: React.PropTypes.func.isRequired
  };

  constructor(){
    super();
    this.state = {
      shouldShowCalendar: false
    };
    this.closeDatePicker = this.closeDatePicker.bind(this);
  }

  changeDay(currentDate, numDays){
    const currentDay = currentDate.getDate();
    var newDate = new Date(currentDate.getTime());
    newDate.setHours(0,0,0,0); // Zero time fields
    newDate.setDate(currentDay + numDays);
    return newDate;
  }

  visualDate(date){
    return date.toDateString();
  }

  prevClick(){
    this.props.updateDate(this.changeDay(this.props.date, -1));
  }

  nextClick(){
    this.props.updateDate(this.changeDay(this.props.date, 1));
  }

  closeDatePicker(){
    this.setState({shouldShowCalendar: false});
  }

  componentDidMount(){
    window.addEventListener("click", this.closeDatePicker);
  }

  componentWillUnmount(){
    window.removeEventListener('click', this.closeDatePicker);
  }

  handleDateChange(date){
    this.props.updateDate(date);
    this.setState({shouldShowCalendar: false});
  }

  render(){

    return (
      <div className="c-date-picker" onClick={(e)=>e.stopPropagation()}>
        <button className="c-btn c-btn--previous" onClick={() => this.prevClick()}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <path d="M14 20l10 10 10-10z"/>
            <path d="M0 0h48v48h-48z" fill="none"/>
          </svg>
        </button>
        <button className="c-btn c-btn--date" onClick={()=>{this.setState({shouldShowCalendar: !this.state.shouldShowCalendar})}}>
          <span>{this.visualDate(this.props.date)}</span>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <path d="M34 24h-10v10h10v-10zm-2-22v4h-16v-4h-4v4h-2c-2.21 0-3.98 1.79-3.98 4l-.02 28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4v-28c0-2.21-1.79-4-4-4h-2v-4h-4zm6 36h-28v-22h28v22z"/>
            <path d="M0 0h48v48h-48z" fill="none"/>
          </svg>
        </button>
        <button className="c-btn c-btn--next" onClick={() => this.nextClick()}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <path d="M14 20l10 10 10-10z"/>
            <path d="M0 0h48v48h-48z" fill="none"/>
          </svg>
        </button>
        <Datepicker
          selected={moment(this.props.date)}
          onChange={(date) => this.handleDateChange(date.toDate())}
          shouldShow = {this.state.shouldShowCalendar}
          inline
        />
      </div>
    );
  }
};
