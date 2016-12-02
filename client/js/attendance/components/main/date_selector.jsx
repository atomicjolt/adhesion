import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
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

  prevClick(e) {
    e.stopPropagation();
    this.props.updateDate(DateSelector.changeDay(this.props.date, -1));
  }

  nextClick(e) {
    e.stopPropagation();
    this.props.updateDate(DateSelector.changeDay(this.props.date, 1));
  }

  handleDateChange(date) {
    this.props.updateDate(date);
  }

  toggleCalendar() {
    this.datePicker.setOpen(!this.datePicker.state.open);
  }

  render() {
    return (
      <div className="c-date-picker" >
        <SvgButton
          type="previous"
          className="c-btn c-btn--previous"
          onClick={e => this.prevClick(e)}
          noIconClass
        />
        <SvgButton
          noIconClass
          type="date"
          className="c-btn c-btn--date"
          onClick={() => this.toggleCalendar()}
        >
          <DatePicker
            readOnly
            ref={(datePicker) => { this.datePicker = datePicker; }}
            dateFormat="ddd MMM Do YYYY"
            selected={moment(this.props.date)}
            onChange={date => this.handleDateChange(date.toDate())}
          />
        </SvgButton>
        <SvgButton
          type="next"
          className="c-btn c-btn--next"
          onClick={e => this.nextClick(e)}
          noIconClass
        />
      </div>
    );
  }
}
