import React from 'react';
import moment     from 'moment';
import Datepicker from './datepicker';

const DateIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48">
    <path d="M34 24h-10v10h10v-10zm-2-22v4h-16v-4h-4v4h-2c-2.21 0-3.98 1.79-3.98 4l-.02 28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4v-28c0-2.21-1.79-4-4-4h-2v-4h-4zm6 36h-28v-22h28v22z"/>
    <path d="M0 0h48v48h-48z" fill="none"/>
  </svg>
);

export default class RangePicker extends React.Component{
  static propTypes = {
    onStartChange: React.PropTypes.func.isRequired,
    onEndChange: React.PropTypes.func.isRequired,
    startDate: React.PropTypes.object.isRequired,
    endDate: React.PropTypes.object.isRequired
  };

  constructor(){
    super();
    this.state = {shouldShowCalendar:[false, false]};
    this.closeCalendars = this.closeCalendars.bind(this);
  }
  visualDate(date){
    return date.toISOString().split('T')[0];
  }
  componentDidMount(){
    window.addEventListener("click", this.closeCalendars);
  }

  componentWillUnmount(){
    window.removeEventListener('click', this.closeCalendars);
  }

  closeCalendars(){
    this.setState({shouldShowCalendar:[false, false]});
  }

  render(){
    return (
      <div>
        <div className="c-popup__label">
          <span>Start Date</span>
          <button
            className="c-btn  c-btn--date"
            onClick={(e) => {
              e.stopPropagation();
              this.setState({shouldShowCalendar:[true, false]});}
            }>
            <span>{this.visualDate(this.props.startDate)}</span>
            <DateIcon />
          </button>
          <Datepicker
            selected={moment(this.props.startDate)}
            onChange={(date) => {
              this.props.onStartChange(date.toDate());
              this.closeCalendars();
            }}
            shouldShow = {this.state.shouldShowCalendar[0]}
            inline />
        </div>
        <div className="c-popup__label">
          <span>End Date</span>
          <button
            className="c-btn  c-btn--date"
            onClick={(e) => {
              e.stopPropagation();
              this.setState({shouldShowCalendar:[false, true]});}
            }>
            <span>{this.visualDate(this.props.endDate)}</span>
            <DateIcon />
          </button>
          <Datepicker
            selected={moment(this.props.endDate)}
            onChange={(date) => {
              this.props.onEndChange(date.toDate());
              this.closeCalendars();
            }}
            shouldShow = {this.state.shouldShowCalendar[1]}
            inline />
        </div>
      </div>
    );
  }
};
