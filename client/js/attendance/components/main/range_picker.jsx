import React from 'react';
import moment from 'moment';
import Datepicker from 'react-datepicker';
import SvgButton from '../../../common_components/svg_button';

export default class RangePicker extends React.Component {
  static propTypes = {
    onStartChange: React.PropTypes.func.isRequired,
    onEndChange: React.PropTypes.func.isRequired,
    startDate: React.PropTypes.instanceOf(Date).isRequired,
    endDate: React.PropTypes.instanceOf(Date).isRequired,
  };

  static visualDate(date) {
    return date.toISOString().split('T')[0];
  }

  constructor() {
    super();
    this.state = {
      startPickerClosed: true,
      endPickerClosed: true,
    };
  }

  toggleCalendar(pickerId) {
    this.setState({
      [`${pickerId}PickerClosed`]: !this.state[`${pickerId}PickerClosed`]
    },
      this[`${pickerId}DatePicker`].setOpen(this.state[`${pickerId}PickerClosed`])
    );
  }

  render() {
    return (
      <div>
        <div className="c-popup__label">
          <span>Start Date</span>
          <SvgButton
            type="date"
            ariaLabel="Start Date"
            className="c-btn c-btn--date"
            onClick={() => this.toggleCalendar('start')}
            onBlur={() => this.setState({
              startPickerClosed: true
            })}
          >
            <Datepicker
              readOnly
              ref={(datePicker) => { this.startDatePicker = datePicker; }}
              selected={moment(this.props.startDate)}
              onChange={(date) => {
                this.props.onStartChange(date.toDate());
              }}
            />
          </SvgButton>
        </div>
        <div className="c-popup__label">
          <span>End Date</span>
          <SvgButton
            type="date"
            ariaLabel="End Date"
            className="c-btn c-btn--date"
            onClick={() => this.toggleCalendar('end')}
            onBlur={() => this.setState({
              endPickerClosed: true
            })}
          >
            <Datepicker
              readOnly
              ref={(datePicker) => { this.endDatePicker = datePicker; }}
              selected={moment(this.props.endDate)}
              onChange={(date) => {
                this.props.onEndChange(date.toDate());
              }}
            />
          </SvgButton>
        </div>
      </div>
    );
  }
}
