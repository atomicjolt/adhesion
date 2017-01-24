import React             from 'react';
import moment            from 'moment';
import _                 from 'lodash';
import Defines           from '../../defines';
import hashHistory       from '../../../history';
import HoverButton       from '../common/hover_button';
import PopupMenu         from './popup_menu';
import MessageInstructor from './message_instructor';
import ConfirmTakeExam   from './confirm_take_exam';
import ScheduleForm      from './schedule_form';

export default class ProctorCode extends React.Component {
  static propTypes = {
    assignedExam: React.PropTypes.shape({}),
    proctorCode: React.PropTypes.shape({}),
    sendMessage: React.PropTypes.func.isRequired,
    showModal: React.PropTypes.func.isRequired,
    hideModal: React.PropTypes.func.isRequired,
    openSettings: React.PropTypes.func.isRequired,
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
      }
    };
  }

  getScheduleOption() {
    const { assignedExam } = this.props;
    const styles = this.getStyles();
    if (assignedExam.status === 'pending') {
      return (
        <div>
          <HoverButton
            style={styles.scheduleButton}
            hoveredStyle={styles.scheduleHoverStyle}
            onClick={() => this.openScheduleModal()}
          >
            Schedule
          </HoverButton>
          <div>{assignedExam.message}</div>
        </div>
      );
    }
    return 'not implemented';
  }

  iconClick() {
    this.setState({ opened: !this.state.opened });
  }

  sendMessage(id, body, subject) {
    this.props.sendMessage(
      id,
      body,
      subject,
    );
    this.props.hideModal();
  }

  takeExam() {
  //  TODO: write this (link to new canvas route)
    const { assignedExam } = this.props;
    hashHistory.push(`/enter_answers/user/${assignedExam.student_id}/course/${assignedExam.course_id}/quiz/${assignedExam.exam_id}`);
    this.props.hideModal();
  }

  openScheduleModal() {
    const { assignedExam } = this.props;
    this.props.openSettings(null);
    this.props.showModal(<ScheduleForm
      studentName={assignedExam.student_name}
      studentId={assignedExam.student_id}
      courseName={assignedExam.course_name}
      examName={assignedExam.exam_name}
      message={assignedExam.message}
      scheduleExam={() => {}}
      closeModal={() => this.props.hideModal()}
    />);
  }

  openMessageModal(id) {
    this.props.openSettings(null);
    this.props.showModal(<MessageInstructor
      sendMessage={(body, subject) => this.sendMessage(id, body, subject)}
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

  render() {
    const styles = this.getStyles();
    const { assignedExam, proctorCode, settingsOpen, openSettings } = this.props;
    return (
      <tr>
        <td style={styles.td}>
          <div style={styles.bigAndBold}>{assignedExam.student_name}</div>
          <div>{assignedExam.student_id}</div>
        </td>
        <td style={styles.td}>
          <div style={styles.largeFont}>{assignedExam.exam_name}</div>
          <div>{assignedExam.course_name}</div>
          <div>{assignedExam.instructor_name}</div>
          <div>{moment(proctorCode.created_at).format('DD MMM YY H:m')}</div>
        </td>
        <td style={styles.td}>
          {this.getScheduleOption()}
        </td>
        <td style={styles.td}>
          <div style={styles.status}>
            <div style={styles.bigAndBold}>{_.capitalize(assignedExam.status)}</div>
            <div>{/* the date will go here */}</div>
          </div>
          <HoverButton
            style={styles.button}
            onClick={() => openSettings(settingsOpen ? null : proctorCode.id)}
            hoveredStyle={styles.hoveredStyle}
          >
            <i className="material-icons">settings</i>
          </HoverButton>
          {
            settingsOpen ?
              <PopupMenu
                style={styles.popupMenu}
                status={assignedExam.status}
                openMessageModal={() => this.openMessageModal(assignedExam.instructor_id)}
                openExamModal={() => this.openExamModal()}
                examId={assignedExam.exam_id}
                courseId={assignedExam.course_id}
              /> : null
          }
        </td>
      </tr>
    );
  }
}
