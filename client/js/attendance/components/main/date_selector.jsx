import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import SvgButton from '../../../common_components/svg_button';

export default class DateSelector extends React.Component {

  static propTypes = {
    date: React.PropTypes.string.isRequired,
    updateDate: React.PropTypes.func.isRequired,
  };

  static changeDay(currentDate, numDays) {
    const newDate = moment(currentDate, 'ddd MMM Do YYYY');
    newDate.add(numDays, 'days');
    return newDate.toDate().toDateString();
  }

  constructor() {
    super();
    // Local state for date picker. Since the datepicker auto-opens on the first
    // click, we want to anticipate that by having datepickerClosed set to true first.
    this.state = {
      datePickerClosed: true,
    };
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
    this.setState({ datePickerClosed: !this.state.datepickerClosed },
      this.datePicker.setOpen(this.state.datepickerClosed)
    );
  }

  render() {
    return (
      <div className="c-date-picker" >
        <SvgButton
          type="previous"
          className="c-btn c-btn--previous"
          ariaLabel="previous day"
          onClick={e => this.prevClick(e)}
          noIconClass
        />
        <SvgButton
          noIconClass
          type="date"
          ariaLabel="Date picker"
          className="c-btn c-btn--date"
          onClick={() => this.toggleCalendar()}
          onBlur={() => this.setState(
            { datePickerClosed: true }
          )}
        >
          <DatePicker
            readOnly
            ref={(datePicker) => { this.datePicker = datePicker; }}
            dateFormat="ddd MMM Do YYYY"
            selected={moment(this.props.date, 'ddd MMM Do YYYY')}
            onChange={date => this.handleDateChange(date.toDate())}
          />
        </SvgButton>
        <SvgButton
          type="next"
          className="c-btn c-btn--next"
          ariaLabel="next day"
          onClick={e => this.nextClick(e)}
          noIconClass
        />
      </div>
    );
  }
}
