import React from 'react';
import { ATTENDANCE_STATES as AttendanceStates } from '../../reducers/student';
import {AbsentIcon, PresentIcon, LateIcon}       from './attendance_icons';

export default class Student extends React.Component {
  static propTypes = {
    student: React.PropTypes.object.isRequired,
    updateStudentAttendance: React.PropTypes.func.isRequired,
    status: React.PropTypes.string
  };

  getNewStatus(currentStatus, newStatus){
    return currentStatus != newStatus ? newStatus : ""; // Toggle status
  }

  updateStatus(student, currentStatus, newStatus){
    this.props.updateStudentAttendance(student, this.getNewStatus(currentStatus, newStatus));
  }

  render(){
    const id = this.props.student.lms_student_id;
    const name = this.props.student.name;
    const status = this.props.status;
    const student = this.props.student;

    return (
      <tr>
        <td>
          <img className="c-profile-pic" src={`${this.props.student.avatar_url}`} alt=""/>
        </td>
        <td>
          <span className="c-name">{name}</span>
        </td>
        <td className="c-attendance">
          <label className="c-present">
            <input
              type="radio"
              name={`radio1_${id}`}
              onChange={() => this.updateStatus(student, status, AttendanceStates.PRESENT)}
              checked={status == AttendanceStates.PRESENT}
            />
            <PresentIcon />
          </label>
          <label className="c-late">
            <input
              type="radio"
              name={`radio1_${id}`}
              onChange={() => this.updateStatus(student, status, AttendanceStates.LATE)}
              checked={status == AttendanceStates.LATE}
            />
            <LateIcon />
          </label>
          <label className="c-absent">
            <input
              type="radio"
              name={`radio1_${id}`}
              onChange={() => this.updateStatus(student, status, AttendanceStates.ABSENT)}
              checked={status == AttendanceStates.ABSENT}
            />
            <AbsentIcon />
          </label>
        </td>
      </tr>
    );
  }
};
