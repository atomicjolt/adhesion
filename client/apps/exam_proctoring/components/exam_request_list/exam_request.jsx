import React             from 'react';
import PropTypes from 'prop-types';
import moment            from 'moment';
import _                 from 'lodash';
import Defines           from '../../defines';
import HoverButton       from '../common/hover_button';
import PopupMenu         from './popup_menu';
import MessageStudent    from './message_student';
import ConfirmTakeExam   from './confirm_take_exam';
import ScheduleForm      from './schedule_form';

export default class ExamRequest extends React.Component {
  static propTypes = {
    examRequest: PropTypes.shape({
      student_id: PropTypes.number.isRequired,
      exam_name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired
    }),
    examRequestList: PropTypes.arrayOf(
      PropTypes.shape({})
    ).isRequired,
    sendMessage: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    scheduleExam: PropTypes.func.isRequired,
    openSettings: PropTypes.func.isRequired,
    startExam: PropTypes.func.isRequired,
    enterAnswers: PropTypes.func.isRequired,
    finishExam: PropTypes.func.isRequired,
    getSignedUrl: PropTypes.func.isRequired,
    settingsOpen: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      opened: false,
      messageOpened: false,
    };
  }

  getStyles() {
    const { settingsOpen } = this.props;
    return {
      td: {
        textAlign: 'left',
        padding: '20px 20px',
        borderBottom: `1px solid ${Defines.lightGrey}`,
        color: Defines.darkGrey,
        verticalAlign: 'top',
        backgroundColor: settingsOpen ? Defines.lightGrey : 'white',
        position: 'relative'
      },
      bigAndBold: {
        fontWeight: 'bold',
        fontSize: '1.2em',
      },
      largeFont: {
        fontSize: '1.2em',
      },
      button: {
        float: 'right',
        color: settingsOpen ? Defines.darkGrey : Defines.lightGrey,
        backgroundColor: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.8em',
      },
      startFinishButton: {
        backgroundColor: Defines.lightGrey,
        color: Defines.darkGrey,
        border: 'none',
        cursor: 'pointer',
        fontSize: '1em',
        padding: '10px 20px',
        marginTop: '5px'
      },
      startFinishedHovered: {
        backgroundColor: Defines.lightText,
        color: 'white'
      },
      hoveredStyle: {
        color: Defines.darkGrey,
      },
      status: {
        width: '80%',
        float: 'left',
      },
      popupMenu: {
        position: 'absolute',
        top: '63px',
        right: '20px',
        zIndex: '1',
      },
      scheduleButton: {
        border: 'none',
        color: Defines.linkBlue,
        fontSize: '1em',
        padding: '0px',
        backgroundColor: 'white',
        cursor: 'pointer'
      },
      scheduleHoverStyle: {
        color: Defines.highlightedText,
      },
      scheduleInfo: {
        color: Defines.lightText,
      }
    };
  }

  getScheduleOption() {
    const { examRequest } = this.props;
    const styles = this.getStyles();
    if (examRequest.status === 'requested') {
      return (
        <div>
          <HoverButton
            className="qa-schedule-btn"
            style={styles.scheduleButton}
            hoveredStyle={styles.scheduleHoverStyle}
            onClick={() => this.openScheduleModal()}
          >
            Schedule
          </HoverButton>
          <div>{examRequest.message}</div>
        </div>
      );
    }
    if (_.includes(['scheduled', 'started', 'finished', 'entering answers'], examRequest.status) && examRequest.scheduled_date) {
      return (
        <div className="qa-schedule-info" style={styles.scheduleInfo}>
          <div>{moment(examRequest.scheduled_date).format('D MMM YYYY')}</div>
          <div>{examRequest.scheduled_time}</div>
        </div>
      );
    }
    return '';
  }

  getStartButton(styles, studentHasExamStarted) {
    const disabled = studentHasExamStarted ? {
      cursor: 'not-allowed',
      color: Defines.lightGrey,
      backgroundColor: 'white',
      outline: 'none'
    } : {};

    if (this.props.examRequest.status === 'scheduled') {
      return (
        <HoverButton
          className="qa-start-btn"
          style={{ ...styles.startFinishButton, ...disabled }}
          hoveredStyle={{ ...styles.startFinishedHovered, ...disabled }}
          onClick={studentHasExamStarted ? () => {} : () => this.startExam()}
        >
          START
        </HoverButton>
      );
    } else if (_.includes(['started', 'entering answers'], this.props.examRequest.status)) {
      return (
        <HoverButton
          className="qa-finish-button"
          style={styles.startFinishButton}
          hoveredStyle={styles.startFinishedHovered}
          onClick={() => this.finishExam()}
        >
          Finish
        </HoverButton>
      );
    }
    return null;
  }

  getStatus() {
    if (_.includes(['finished', 'requested', 'entering answers'], this.props.examRequest.status)) {
      return _.capitalize(this.props.examRequest.status);
    }
    return null;
  }

  iconClick() {
    this.setState({ opened: !this.state.opened });
  }

  sendMessage(body, subject) {
    this.props.sendMessage(
      this.props.examRequest.student_id,
      body,
      subject,
    );
    this.props.hideModal();
  }

  takeExam() {
    const { examRequest } = this.props;
    const newWindow = window.open('');
    this.props.getSignedUrl(examRequest.id, newWindow);
    this.enterAnswers();
    this.props.hideModal();
  }

  scheduleExam(selectedDate, selectedTime, message) {
    this.props.scheduleExam(this.props.examRequest.id, selectedDate, `${selectedTime.value} ${selectedTime.timeZone}`);
    this.sendMessage(message, `Your exam (${this.props.examRequest.exam_name}) has been scheduled`);
    this.props.hideModal();
  }

  openScheduleModal() {
    const { examRequest } = this.props;

    this.props.showModal(
      <ScheduleForm
        studentName={examRequest.student_name}
        studentId={examRequest.student_id}
        courseName={examRequest.course_name}
        testingCenterName={examRequest.testing_center_name}
        examName={examRequest.exam_name}
        message={examRequest.message}
        scheduleExam={(selectedDate, selectedTime, message) => {
          this.scheduleExam(selectedDate, selectedTime, message);
        }}
        closeModal={() => this.props.hideModal()}
      />
    );
  }

  openMessageModal() {
    this.props.showModal(<MessageStudent
      sendMessage={(body, subject) => this.sendMessage(body, subject)}
      closeMessageModal={() => this.props.hideModal()}
    />);
  }

  openExamModal() {
    this.props.showModal(
      <ConfirmTakeExam
        takeExam={() => this.takeExam()}
        closeModal={() => this.props.hideModal()}
      />
    );
  }

  startExam() {
    this.props.startExam(this.props.examRequest.id);
  }

  enterAnswers() {
    this.props.enterAnswers(this.props.examRequest.id);
  }

  finishExam() {
    this.props.finishExam(this.props.examRequest.id);
  }

  render() {
    const styles = this.getStyles();
    const { examRequest, settingsOpen, openSettings } = this.props;

    const studentHasExamStarted = !!_.find(this.props.examRequestList, request => (
      request.student_id === examRequest.student_id &&
      request.id !== examRequest.id &&
      _.includes(['started', 'in progress'], request.status)
    ));

    return (
      <tr className="qa-exam-request-row">
        <td style={styles.td}>
          <div style={styles.bigAndBold}>{examRequest.student_name}</div>
          <div>{examRequest.student_id}</div>
        </td>
        <td style={styles.td}>
          <div style={styles.largeFont}>{examRequest.exam_name}</div>
          <div>{examRequest.course_name}</div>
          <div>{examRequest.instructor_name}</div>
          <div>{moment(examRequest.created_at).format('DD MMM YY H:m')}</div>
        </td>
        <td style={styles.td}>
          {this.getScheduleOption()}
        </td>
        <td style={styles.td}>
          <div style={styles.status}>
            <div style={styles.bigAndBold}>{this.getStatus()}</div>
            <div>{this.getStartButton(styles, studentHasExamStarted)}</div>
          </div>
          <HoverButton
            style={styles.button}
            onClick={e => openSettings(e, settingsOpen ? null : examRequest.id)}
            hoveredStyle={styles.hoveredStyle}
          >
            <i className="material-icons">settings</i>
          </HoverButton>
          {
            settingsOpen ?
              <PopupMenu
                style={styles.popupMenu}
                status={examRequest.status}
                openMessageModal={() => this.openMessageModal()}
                openExamModal={() => this.openExamModal()}
                startExam={() => this.startExam()}
                finishExam={() => this.finishExam()}
                examId={examRequest.exam_id}
                courseId={examRequest.course_id}
                studentHasExamStarted={studentHasExamStarted}
              /> : null
          }
        </td>
      </tr>
    );
  }
}
