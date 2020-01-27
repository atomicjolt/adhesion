import React from 'react';
import PropTypes from 'prop-types';
import { ATTENDANCE_STATES as AttendanceStates } from '../../reducers/student';
import { AbsentIcon, PresentIcon, LateIcon } from './attendance_icons';

export default class Student extends React.Component {
  static propTypes = {
    student: PropTypes.shape({
      lms_student_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      avatar_url: PropTypes.string.isRequired,
    }).isRequired,
    updateStudentAttendance: PropTypes.func.isRequired,
    status: PropTypes.string,
    index: PropTypes.number,
  };

  static getNewStatus(currentStatus, newStatus) {
    return currentStatus !== newStatus ? newStatus : ''; // Toggle status
  }

  updateStatus(student, currentStatus, newStatus) {
    this.props.updateStudentAttendance(student, Student.getNewStatus(currentStatus, newStatus));
  }

  render() {
    const { status, student, index } = this.props;
    const id = student.lms_student_id;
    const name = student.name;

    const present = status === AttendanceStates.PRESENT;
    const late = status === AttendanceStates.LATE;
    const absent = status === AttendanceStates.ABSENT;
    const processing = status === AttendanceStates.PROCESSING;

    let processingHtml = null;

    if (processing) {
      processingHtml = (
        <td>
          <div className="loading">
            <div className="c-loading-icon" role="img" aria-label="loading" />
          </div>
        </td>
      );
    } else {
      processingHtml = (
        <td className="c-attendance" >
          <div className={`c-present qa-student-present-${index} ${present ? `qa-student-present-active-${index}` : ''}`}>
            <input
              aria-checked={present}
              aria-setsize="4"
              aria-posinset="1"
              aria-label="Present"
              type="radio"
              name={`radio1_${id}`}
              id={`radio1_${id}`}
              onChange={() => this.updateStatus(student, status, AttendanceStates.PRESENT)}
              checked={present}
            />
            <label htmlFor={`radio1_${id}`} ><PresentIcon /></label>
          </div>
          <div className={`c-late qa-student-late-${index} ${late ? `qa-student-late-active-${index}` : ''}`}>
            <input
              aria-checked={late}
              aria-setsize="4"
              aria-posinset="2"
              aria-label="Late"
              type="radio"
              name={`radio1_${id}`}
              id={`radio2_${id}`}
              onChange={() => this.updateStatus(student, status, AttendanceStates.LATE)}
              checked={late}
            />
            <label htmlFor={`radio2_${id}`}><LateIcon /></label>
          </div>
          <div className={`c-absent qa-student-absent-${index} ${absent ? `qa-student-absent-active-${index}` : ''}`}>
            <input
              aria-checked={absent}
              aria-setsize="4"
              aria-posinset="3"
              aria-label="Absent"
              type="radio"
              name={`radio1_${id}`}
              id={`radio3_${id}`}
              onChange={() => this.updateStatus(student, status, AttendanceStates.ABSENT)}
              checked={absent}
            />
            <label htmlFor={`radio3_${id}`}><AbsentIcon /></label>
          </div>
        </td>
      );
    }

    return (
      <tr>
        <td>
          <img className="c-profile-pic" src={`${this.props.student.avatar_url}`} alt="" />
        </td>
        <th scope="row" className="c-align-header">
          <span tabIndex="0" className={`c-name qa-student-name-${index}`}>{name}</span>
        </th>
        { processingHtml }
      </tr>
    );
  }
}
