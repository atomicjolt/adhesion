import React from 'react';
import moment from 'moment';
import Datepicker from './datepicker';
import SvgButton from '../../../common_components/svg_button';

export default class DateSelector extends React.Component {

  static propTypes = {
    date: React.PropTypes.instanceOf(Date).isRequired,
    updateDate: React.PropTypes.func.isRequired,
  };

  static changeDay(currentDate, numDays) {
    const currentDay = currentDate.getDate();
    const newDate = new Date(currentDate.getTime());
    newDate.setHours(0, 0, 0, 0); // Zero time fields
    newDate.setDate(currentDay + numDays);
    return newDate;
  }

  static visualDate(date) {
    return date.toDateString();
  }

  constructor() {
    super();
    this.state = {
      shouldShowCalendar: false,
    };
    this.closeDatePicker = this.closeDatePicker.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.closeDatePicker);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.closeDatePicker);
  }

  prevClick() {
    this.props.updateDate(DateSelector.changeDay(this.props.date, -1));
  }

  nextClick() {
    this.props.updateDate(DateSelector.changeDay(this.props.date, 1));
  }

  closeDatePicker() {
    this.setState({ shouldShowCalendar: false });
  }

  handleDateChange(date) {
    this.props.updateDate(date);
    this.setState({ shouldShowCalendar: false });
  }

  render() {
    return (
      <div className="c-date-picker" onClick={e => e.stopPropagation()}>
        <SvgButton
          type="previous"
          className="c-btn c-btn--previous"
          onClick={() => this.prevClick()}
          noIconClass
        />
        <SvgButton
          type="date"
          className="c-btn c-btn--date"
          onClick={() => this.setState({ shouldShowCalendar: !this.state.shouldShowCalendar })}
          noIconClass
        >
          <span>{DateSelector.visualDate(this.props.date)}</span>
        </SvgButton>
        <SvgButton
          type="next"
          className="c-btn c-btn--next"
          onClick={() => this.nextClick()}
          noIconClass
        />
        <Datepicker
          selected={moment(this.props.date)}
          onChange={date => this.handleDateChange(date.toDate())}
          shouldShow={this.state.shouldShowCalendar}
          inline
        />
      </div>
    );
  }
}
