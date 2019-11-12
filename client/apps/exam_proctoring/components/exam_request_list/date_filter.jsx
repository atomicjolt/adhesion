import React        from 'react';
import PropTypes from 'prop-types';
import moment       from 'moment';
import DateSelector from '../common/date_selector';
import HoverButton  from '../common/hover_button';
import Defines      from '../../defines';

export default class DateFilter extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    date: PropTypes.shape({}),
    style: PropTypes.shape({}),
  };

  static getStyles() {
    return {
      container: {
        display: 'flex',
      },
      selector: {
        flex: '.8',
      },
      button: {
        flex: '.1',
        backgroundColor: 'white',
        color: Defines.darkGrey,
        border: `2px solid ${Defines.lightGrey}`,
        padding: '0px 5px',
        verticalAlign: 'middle',
      },
      rightButton: {
        marginLeft: '5px',
      },
      leftButton: {
        marginRight: '5px',
      }
    };
  }

  static changeDay(currentDate, numDays) {
    const newDate = moment(currentDate, 'ddd MMM Do YYYY');
    newDate.add(numDays, 'days');
    return newDate.toDate();
  }

  arrowClick(daysToChange) {
    this.props.onChange(DateFilter.changeDay(this.props.date, daysToChange));
  }

  render() {
    const styles = DateFilter.getStyles();
    return (
      <div style={{ ...styles.container, ...this.props.style }}>
        <HoverButton
          className="qa-date-picker-left"
          style={{ ...styles.button, ...styles.leftButton }}
          onClick={() => this.arrowClick(-1)}
        >
          <i className="material-icons">keyboard_arrow_left</i>
        </HoverButton>
        <DateSelector
          style={styles.selector}
          onChange={date => this.props.onChange(date.toDate())}
          date={this.props.date}
          format="MMM Do"
        />
        <HoverButton
          className="qa-date-picker-right"
          style={{ ...styles.button, ...styles.rightButton }}
          onClick={() => this.arrowClick(1)}
        >
          <i className="material-icons">keyboard_arrow_right</i>
        </HoverButton>
      </div>
    );
  }
}
