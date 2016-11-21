import React      from 'react';
import moment     from 'moment';
import Datepicker from './datepicker';
import SvgButton  from '../../../common_components/svg_button';

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

  dateClick(e, shouldShowCalendar){
    e.stopPropagation();
    this.setState({shouldShowCalendar});
  }

  render(){
    return (
      <div>
        <div className="c-popup__label">
          <span>Start Date</span>
          <SvgButton type="date" className="c-btn c-btn--date" onClick={(e)=>this.dateClick(e, [true, false])}>
            <span>{this.visualDate(this.props.startDate)}</span>
          </SvgButton>
          { this.state.shouldShowCalendar[0] ? <Datepicker
            selected   = {moment(this.props.startDate)}
            onChange   = {(date) => {
              this.props.onStartChange(date.toDate());
              this.closeCalendars();
            }}
            inline
          /> : null }
        </div>
        <div className="c-popup__label">
          <span>End Date</span>
          <SvgButton type="date" className="c-btn  c-btn--date" onClick={(e)=>this.dateClick(e, [false, true])}>
            <span>{this.visualDate(this.props.startDate)}</span>
          </SvgButton>
          <Datepicker
            selected   = {moment(this.props.endDate)}
            onChange   = {(date) => {
              this.props.onEndChange(date.toDate());
              this.closeCalendars();
            }}
            shouldShow = {this.state.shouldShowCalendar[1]}
            inline
          />
        </div>
      </div>
    );
  }
};
