"use strict";

import { connect }                    from "react-redux";
import React                          from 'react';
import assets                         from '../../../libs/assets';
import canvasRequest                  from "../../../libs/canvas/action";
import { list_users_in_course_users } from "../../../libs/canvas/constants/courses";
import * as applicationActions        from '../../actions/application';
import * as attendanceActions         from '../../actions/attendance';
import * as errorActions              from '../../actions/error';
import DateSelector                   from './date_selector';
import Student                        from './student';
import {ATTENDANCE_STATES as AttendanceStates } from '../../reducers/student';
import ExportModal                    from './export_csv';

const select = (state, props) => {
  const currentDate = state.application.date;
  return {
    students: state.student.all,
    settings: state.settings,
    application: state.application,
    error: state.error,
    attendance: state.attendance.get(currentDate) || {}
  };
};

export class StudentList extends React.Component{
  static propTypes = {
    error: React.PropTypes.object.isRequired,
    students: React.PropTypes.object.isRequired,
    settings: React.PropTypes.object.isRequired,
    application: React.PropTypes.object.isRequired,
    attendance: React.PropTypes.object.isRequired
  };

  constructor(){
    super();
    this.state = {
      showExportModal: false
    };
  }

  componentWillMount(){
    this.props.canvasRequest(list_users_in_course_users, {course_id: this.props.settings.lms_course_id, enrollment_type: ["student"], include: ["avatar_url"]}, {});
    this.props.getStudentAttendance(this.props.application.date, this.props.settings.lms_course_id);
  }

  updateStudentAttendance(student, status){
    this.props.markStudents([{
      name: student.name,
      lms_student_id: student.lms_student_id,
      sortable_name: student.sortable_name
    }],
      this.props.settings.lms_course_id,
      this.props.application.date,
      status
    );
  }

  handleDateChange(date){
    this.props.changeDate(date);
    //TODO Find a way to wrap these into one dispatch
    this.props.getStudentAttendance(date, this.props.settings.lms_course_id);
  }

  sortStudents(students){
    const unorderedStudents = _.reduce(students, (students, student) => {
      students.push(student);
      return students;
    }, []);
    return unorderedStudents.sort((a, b) => {
      if(a.sortable_name < b.sortable_name) return -1;
      return 1;
    });
  }

  students(){     //get students from store
    const attendance = this.props.attendance;
    const students = _.map(this.sortStudents(this.props.students), (student) => {
      const id = student.lms_student_id;
      const props = {
        student,
        updateStudentAttendance: (student, status) => this.updateStudentAttendance(student, status),
        status: attendance[id] ? attendance[id].status : ""
      };
      return (<Student key={id} {...props}/>);
    });
    return students;
  }

  markAll(status){
    const students = _.reduce(this.props.students, (students, student)=>{
      students.push(student);
      return students;
    }, []);
    this.props.markStudents(students, this.props.settings.lms_course_id, this.props.application.date, status);
    return students;
  }

  toggleExportModal(){
    this.setState({showExportModal: !this.state.showExportModal});
  }

  errorModal(){
    var style = this.props.error.showError ? "c-popup is-open" : "c-popup"

      return (
      <div className={`${style}`}>
        <h3 className="c-popup__title">ERROR! {this.props.error.statusCode}</h3>
        <p className="c-popup__message">Something went wrong.</p>
        <button className="c-popup__btn" onClick={()=>this.props.showError(false)}>Dismiss</button>
      </div>);
  }

  exportModal(){
    if(this.state.showExportModal){
      return <ExportModal
            apiUrl={this.props.settings.apiUrl}
            lmsCourseId={this.props.settings.lms_course_id}
            downloadFile={this.props.downloadFile}
            onExport={() => this.toggleExportModal()}
            onOutsideClick={() => this.toggleExportModal()}
             />
    }
  }


  render(){

    return(
      <div>
        <div className="c-top-bar">
          {this.errorModal()}
          <button className="c-btn c-btn--mark-all" onClick={()=>this.markAll(AttendanceStates.PRESENT)}>Mark All Present</button>
          <button className="c-btn c-btn--unmark-all" onClick={()=>this.markAll("")}>Unmark All</button>
          <button
              className="c-btn c-btn--unmark-all"
              onClick={() => this.toggleExportModal()}>Export</button>
          {this.exportModal()}
          <DateSelector
              date={this.props.application.date}
              updateDate={(date) => this.handleDateChange(date)}/>
        </div>
        <table className="c-table">
          <thead></thead>
          <tbody>
            {this.students()}
          </tbody>
        </table>
      </div>
    );
  }

}

export default connect(select, {canvasRequest, ...applicationActions, ...attendanceActions, ...errorActions}, null, { withRefs: true })(StudentList);
