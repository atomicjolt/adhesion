import React        from 'react';
import Defines      from '../../defines';
import HoverButton  from '../common/hover_button';
import DateSelector from '../common/date_selector';
import TimeSelector from '../common/time_selector';

export default class ScheduleForm extends React.Component {
  static propTypes = {
    studentName: React.PropTypes.string.isRequired,
    studentId: React.PropTypes.number.isRequired,
    examName: React.PropTypes.string.isRequired,
    courseName: React.PropTypes.string.isRequired,
    testingCenterName: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired,
    closeModal:  React.PropTypes.func.isRequired,
    scheduleExam:  React.PropTypes.func.isRequired,
  };

  static getStyles() {
    return {
      popupStyle: {
        boxShadow: `0px 0px 5px ${Defines.darkGrey}`,
        backgroundColor: 'white',
        padding: '25px',
        position: 'fixed',
        top: '5vh',
        left: '25vw',
        right: '25vw',
        zIndex: '2',
        color: Defines.darkGrey,
      },
      buttonStyle: {
        backgroundColor: Defines.tanishBrown,
        // fontSize: '.9em',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
        float: 'right',
      },
      cancelButton: {
        backgroundColor: Defines.lightBackground,
        color: Defines.darkGrey,
        marginRight: '20px'
      },
      textarea: {
        border: `2px solid ${Defines.lightBorder}`,
        padding: '5px',
        fontSize: '.9em',
        flex: '1',
      },
      bold: {
        fontWeight: 'bold',
      },
      selector: {
        flex: '.5',
      },
      selectors: {
        display: 'flex',
        marginTop: '20px',
      },
      timeSelector: {
        paddingLeft: '40px',
      },
      messageContainer: {
        marginTop: '40px',
      },
      textContainer: {
        display: 'flex',
      },
      buttonContainer: {
        marginTop: '20px'
      },
    };
  }

  constructor(props) {
    super(props);
    this.messageField = null;
    this.subjectField =  null;
    this.state = {
      date: new Date(),
      time: {
        value: '0900',
        label: '0900',
      },
      userMessage: '',
      dontUseAutoMessage: false
    };
    this.state.autoMessage = this.buildDateAndTimeMessage(this.state.date, this.state.time);
  }

  onMessageChange(e) {
    if (this.state.dontUseAutoMessage) { return; }
    const { value } = e.target;
    if (value.length < this.state.autoMessage.length) {
      this.setState({ dontUseAutoMessage: true });
    } else if (value.length < this.state.autoMessage.length + this.state.userMessage.length) {
      const newMessage = this.state.userMessage.slice(0, -1);
      this.setState({ userMessage: newMessage });
    } else {
      const newMessage = this.state.userMessage + value[value.length - 1];
      this.setState({ userMessage: newMessage });
    }
  }

  handleDateChange(date) {
    const autoMessage = this.buildDateAndTimeMessage(date, this.state.time);
    this.setState({
      date,
      autoMessage,
    });
    if (!this.state.dontUseAutoMessage) {
      this.messageField.value = autoMessage + this.state.userMessage;
    }
  }

  handleTimeChange(time) {
    const autoMessage = this.buildDateAndTimeMessage(this.state.date, time);
    this.setState({
      time,
      autoMessage,
    });
    if (!this.state.dontUseAutoMessage) {
      this.messageField.value = autoMessage + this.state.userMessage;
    }
  }

  buildDateAndTimeMessage(date, time) {
    return (
      'Your exam has been scheduled\n' +
      `Exam: ${this.props.examName}\n` +
      `Date: ${date.toDateString()}\n` +
      `Time: ${time.value}\n` +
      `Location: ${this.props.testingCenterName}\n` +
      '-----------------------------------\n'
    );
  }

  render() {
    const styles = ScheduleForm.getStyles();
    return (
      <div style={styles.popupStyle}>
        <h2>Schedule Exam</h2>
        <div><span style={styles.bold}>Student: </span>{this.props.studentName}</div>
        <div><span style={styles.bold}>ID: </span>{this.props.studentId}</div>
        <div><span style={styles.bold}>Test: </span>{this.props.examName}</div>
        <div><span style={styles.bold}>Course: </span>{this.props.courseName}</div>
        <div style={{ marginTop: '20px' }}><span style={styles.bold}>Message: </span>{this.props.message}</div>
        <div style={styles.selectors}>
          <DateSelector
            style={styles.selector}
            onChange={date => this.handleDateChange(date.toDate())}
            date={this.state.date}
            header={<div style={styles.dropdownHeader}>DATE</div>}
          />
          <TimeSelector
            value={this.state.time}
            style={{ ...styles.selector, ...styles.timeSelector }}
            onChange={time => this.handleTimeChange(time)}
            header={<div style={styles.dropdownHeader}>TIME</div>}
          />
        </div>
        <div style={styles.messageContainer}>
          <div style={styles.dropdownHeader}>RESPONSE TO STUDENT</div>
          <div style={styles.textContainer}>
            <textarea
              defaultValue={this.state.autoMessage}
              onChange={e => this.onMessageChange(e)}
              style={styles.textarea}
              rows="10"
              ref={(el) => { this.messageField = el; }}
            />
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <HoverButton
            style={styles.buttonStyle}
            onClick={() => this.props.scheduleExam(
              this.state.date,
              this.state.time,
              this.messageField.value
            )}
          >
            SCHEDULE EXAM
          </HoverButton>
          <HoverButton
            style={{ ...styles.buttonStyle, ...styles.cancelButton }}
            onClick={this.props.closeModal}
          >
            CANCEL
          </HoverButton>
        </div>
      </div>
    );
  }
}
