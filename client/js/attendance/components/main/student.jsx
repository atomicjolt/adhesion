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
    index: React.PropTypes.number,
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



    return (
      <tr>
        <td>
          <img className="c-profile-pic" src={`${this.props.student.avatar_url}`} alt="" />
        </td>
        <th scope="row" style={{textAlign:"left", verticalAlign:"middle"}}>
          <span tabIndex="0" className={`c-name qa-student-name-${index}`}>{name}</span>
        </th>
        <td className="c-attendance" role="radiogroup" >
          <div className={`c-present qa-student-present-${index} ${present ? `qa-student-present-active-${index}` : ''}`}>
            <input
              role="radio"
              aria-checked={present}
              aria-setsize="3"
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
              role="radio"
              aria-checked={late}
              aria-setsize="3"
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
              role="radio"
              aria-checked={absent}
              aria-setsize="3"
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
      </tr>
    );
  }
}
