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
        <td className="c-attendance" role="radiogroup" >
          <div className="c-present">
            <input
              role="radio"
              aria-checked={status === AttendanceStates.PRESENT}
              aria-setsize="3"
              aria-posinset="1"
              aria-label="Present"
              type="radio"
              name={`radio1_${id}`}
              id={`radio1_${id}`}
              onChange={() => this.updateStatus(student, status, AttendanceStates.PRESENT)}
              checked={status === AttendanceStates.PRESENT}
            />
            <label htmlFor={`radio1_${id}`} ><PresentIcon /></label>
          </div>
          <div className="c-late">
            <input
              role="radio"
              aria-checked={status === AttendanceStates.LATE}
              aria-setsize="3"
              aria-posinset="2"
              aria-label="Late"
              type="radio"
              name={`radio1_${id}`}
              id={`radio2_${id}`}
              onChange={() => this.updateStatus(student, status, AttendanceStates.LATE)}
              checked={status === AttendanceStates.LATE}
            />
            <label htmlFor={`radio2_${id}`}><LateIcon /></label>
          </div>
          <div className="c-absent">
            <input
              role="radio"
              aria-checked={status === AttendanceStates.ABSENT}
              aria-setsize="3"
              aria-posinset="3"
              aria-label="Absent"
              type="radio"
              name={`radio1_${id}`}
              id={`radio3_${id}`}
              onChange={() => this.updateStatus(student, status, AttendanceStates.ABSENT)}
              checked={status === AttendanceStates.ABSENT}
            />
            <label htmlFor={`radio3_${id}`}><AbsentIcon /></label>
          </div>
        </td>
      </tr>
    );
  }
}
