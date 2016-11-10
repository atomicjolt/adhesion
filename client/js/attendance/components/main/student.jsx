import React from 'react';

import { ATTENDANCE_STATES as AttendanceStates } from '../../reducers/student';

const PresentIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48">
    <path d="M0,0h48v48H0V0z" fill="none"/>
    <path d="M21,27.2L16.8,23L14,25.9l7,7L36,17.9l-2.8-2.8L21,27.2z"/>
    <path d="M24,4C12.9,4,4,12.9,4,24s8.9,20,20,20s20-9,20-20S35,4,24,4z M24,40c-8.8,0-16-7.2-16-16S15.2,8,24,8s16,7.2,16,16
      S32.8,40,24,40z"/>
  </svg>
);

const LateIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48">
    <path d="M0 0h48v48h-48z" fill="none"/>
    <path d="M23.99 4c-11.05 0-19.99 8.95-19.99 20s8.94 20 19.99 20c11.05 0 20.01-8.95 20.01-20s-8.96-20-20.01-20zm.01 36c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16z"/>
    <path d="M25 14h-3v12l10.49 6.3 1.51-2.46-9-5.34z"/>
  </svg>
);

const AbsentIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48">
    <path d="M0 0h48v48h-48z" fill="none"/>
    <path d="M29.17 16l-5.17 5.17-5.17-5.17-2.83 2.83 5.17 5.17-5.17 5.17 2.83 2.83 5.17-5.17 5.17 5.17 2.83-2.83-5.17-5.17 5.17-5.17-2.83-2.83zm-5.17-12c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16z"/>
  </svg>
);

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
                checked={status == AttendanceStates.PRESENT}/>
            <PresentIcon />
          </label>
          <label className="c-late">
            <input
                type="radio"
                name={`radio1_${id}`}
                onChange={() => this.updateStatus(student, status, AttendanceStates.LATE)}
                checked={status == AttendanceStates.LATE}/>
            <LateIcon />
          </label>
          <label className="c-absent">
            <input
                type="radio"
                name={`radio1_${id}`}
                onChange={() => this.updateStatus(student, status, AttendanceStates.ABSENT)}
                checked={status == AttendanceStates.ABSENT}/>
            <AbsentIcon />
          </label>
        </td>
      </tr>
    );
  }
};
