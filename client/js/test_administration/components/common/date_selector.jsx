import React      from 'react';
import DatePicker from 'react-datepicker';
import moment     from 'moment';
import Defines    from '../../defines';

export default class DateSelector extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    date: React.propTypes.shape({}),
    style: React.propTypes.shape({}),
    header: React.propTypes.node,
  }

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
            dateFormat="ddd MMM Do YYYY"
            selected={moment(this.props.date, 'ddd MMM Do YYYY')}
            onChange={this.props.onChange}
          />
          <button style={styles.icon} onMouseDown={e => this.toggleCalendar(e)}>
            <i className="material-icons">today</i>
          </button>
        </div>
      </div>
    );
  }
}
