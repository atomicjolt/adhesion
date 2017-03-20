import React from 'react';
import { ATTENDANCE_STATES as AttendanceStates } from '../../reducers/student';
import { AbsentIcon, PresentIcon, LateIcon } from './attendance_icons';

export default class Student extends React.Component {
  static propTypes = {
    student: React.PropTypes.shape({
      lms_student_id: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired,
      avatar_url: React.PropTypes.string.isRequired,
    }).isRequired,
    updateStudentAttendance: React.PropTypes.func.isRequired,
    status: React.PropTypes.string,
  };

  static getNewStatus(currentStatus, newStatus) {
    return currentStatus !== newStatus ? newStatus : ''; // Toggle status
  }

  updateStatus(student, currentStatus, newStatus) {
    this.props.updateStudentAttendance(student, Student.getNewStatus(currentStatus, newStatus));
  }

  render() {
    const id = this.props.student.lms_student_id;
    const name = this.props.student.name;
    const status = this.props.status;
    const student = this.props.student;

    return (
      <tr>
        <td>
          <img className="c-profile-pic" src={`${this.props.student.avatar_url}`} alt="" />
        </td>
        <td>
          <span tabIndex="0" className="c-name">{name}</span>
        </td>
        <td className="c-attendance">
          <span role="radioGroup">
            <span
              role="radio"
              aria-checked={AttendanceStates.PRESENT}
              aria-setsize="3"
              aria-posinset="1"
              aria-label="present"
            >
              <label
                className="c-present"
                htmlFor={`radio1_${id}`}
                tabIndex="0"
                onKeyPress={() => this.updateStatus(student, status, AttendanceStates.PRESENT)}
              >
                <input
                  tabIndex="0"
                  type="radio"
                  name={`radio1_${id}`}
                  id={`radio1_${id}`}
                  onChange={() => this.updateStatus(student, status, AttendanceStates.PRESENT)}
                  checked={status === AttendanceStates.PRESENT}
                />
                <PresentIcon />
              </label>
            </span>
            <span
              role="radio"
              aria-checked={AttendanceStates.LATE}
              aria-setsize="3"
              aria-posinset="2"
              aria-label="late"
            >
              <label
                className="c-late"
                htmlFor={`radio2_${id}`}
                tabIndex="0"
                onKeyPress={() => this.updateStatus(student, status, AttendanceStates.LATE)}
              >
                <input
                  type="radio"
                  name={`radio1_${id}`}
                  id={`radio2_${id}`}
                  onChange={() => this.updateStatus(student, status, AttendanceStates.LATE)}
                  checked={status === AttendanceStates.LATE}
                />
                <LateIcon />
              </label>
            </span>
            <span
              role="radio"
              aria-checked={AttendanceStates.ABSENT}
              aria-setsize="3"
              aria-posinset="3"
              aria-label="absent"
            >
              <label
                className="c-absent"
                htmlFor={`radio3_${id}`}
                tabIndex="0"
                onKeyPress={() => this.updateStatus(student, status, AttendanceStates.ABSENT)}
              >
                <input
                  type="radio"
                  name={`radio1_${id}`}
                  id={`radio3_${id}`}
                  onChange={() => this.updateStatus(student, status, AttendanceStates.ABSENT)}
                  checked={status === AttendanceStates.ABSENT}
                />
                <AbsentIcon />
              </label>
            </span>
          </span>
        </td>
      </tr>
    );
  }
}
