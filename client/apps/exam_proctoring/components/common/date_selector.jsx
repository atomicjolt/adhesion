import React      from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment     from 'moment';
import Defines    from '../../defines';

export default class DateSelector extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    date: PropTypes.shape({}),
    style: PropTypes.shape({}),
    header: PropTypes.node,
    format: PropTypes.string,
  };

  static getStyles() {
    return {
      icon: {
        position: 'absolute',
        top: '7px',
        right: '5px',
        padding: '0px',
        border: 'none',
        backgroundColor: 'white',
        color: Defines.darkGrey
      }
    };
  }

  toggleCalendar(e) {
    e.preventDefault();
    e.stopPropagation();
    this.datePicker.setOpen(!this.datePicker.state.open);
  }

  render() {
    const styles = DateSelector.getStyles();
    return (
      <div style={this.props.style}>
        {this.props.header}
        <div style={{ position: 'relative' }}>
          <DatePicker
            ref={(datePicker) => { this.datePicker = datePicker; }}
            readOnly
            dateFormat={this.props.format || 'ddd MMM Do YYYY'}
            selected={moment(this.props.date, this.props.format ? this.props.format : 'ddd MMM Do YYYY')}
            onChange={this.props.onChange}
          />
          <button className="qa-calendar-btn" style={styles.icon} onMouseDown={e => this.toggleCalendar(e)}>
            <i className="material-icons">today</i>
          </button>
        </div>
      </div>
    );
  }
}
