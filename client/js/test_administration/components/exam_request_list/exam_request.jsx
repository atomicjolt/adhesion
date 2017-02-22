import React             from 'react';
import moment            from 'moment';
import _                 from 'lodash';
import Defines           from '../../defines';
import hashHistory       from '../../../history';
import HoverButton       from '../common/hover_button';
import PopupMenu         from './popup_menu';
import MessageStudent    from './message_student';
import ConfirmTakeExam   from './confirm_take_exam';
import ScheduleForm      from './schedule_form';

export default class ExamRequest extends React.Component {
  static propTypes = {
    examRequest: React.PropTypes.shape({
      student_id: React.PropTypes.number.isRequired,
      exam_name: React.PropTypes.string.isRequired,
      id: React.PropTypes.number.isRequired,
    }),
    examRequestList: React.PropTypes.arrayOf(
      React.PropTypes.shape({})
    ).isRequired,
    sendMessage: React.PropTypes.func.isRequired,
    showModal: React.PropTypes.func.isRequired,
    hideModal: React.PropTypes.func.isRequired,
    scheduleExam: React.PropTypes.func.isRequired,
    openSettings: React.PropTypes.func.isRequired,
    startExam: React.PropTypes.func.isRequired,
    settingsOpen: React.PropTypes.bool,
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
    if (examRequest.status === 'scheduled') {
      return (
        <div style={styles.scheduleInfo}>
          <div>{moment(examRequest.scheduled_date).format('D MMM YYYY')}</div>
          <div>{examRequest.scheduled_time}</div>
        </div>
      );
    }
    return '';
  }

  getStatus() {
    const { examRequest } = this.props;
    // const styles = this.getStyles();
    if (examRequest.status === 'requested') {
      return _.capitalize(examRequest.status);
    }
    return 'something else';
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
    hashHistory.push(`/enter_answers/${examRequest.id}`);
    this.startExam();
    this.props.hideModal();
  }

  scheduleExam(selectedDate, selectedTime, message) {
    this.props.scheduleExam(this.props.examRequest.id, selectedDate, selectedTime.value);
    this.sendMessage(message, `Your exam (${this.props.examRequest.exam_name}) has been scheduled`);
    this.props.hideModal();
  }

  openScheduleModal() {
    const { examRequest } = this.props;
    this.props.openSettings(null);
    this.props.showModal(
      <ScheduleForm
        studentName={examRequest.student_name}
        studentId={examRequest.student_id}
        courseName={examRequest.course_name}
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
    this.props.openSettings(null);
    this.props.showModal(<MessageStudent
      sendMessage={(body, subject) => this.sendMessage(body, subject)}
      closeMessageModal={() => this.props.hideModal()}
    />);
  }

  openExamModal() {
    this.props.openSettings(null);
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

  render() {
    const styles = this.getStyles();
    const { examRequest, settingsOpen, openSettings } = this.props;

    const studentHasExamStarted = !!_.find(this.props.examRequestList, request => (
      request.student_id === examRequest.student_id &&
      request.id !== examRequest.id &&
      _.includes(['started', 'in progress'], request.status)
    ));

    return (
      <tr>
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
            <div style={styles.bigAndBold}>{_.capitalize(examRequest.status)}</div>
            <div>{/* the date will go here */}</div>
          </div>
          <HoverButton
            style={styles.button}
            onClick={() => openSettings(settingsOpen ? null : examRequest.id)}
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
