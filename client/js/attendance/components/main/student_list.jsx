import { connect } from 'react-redux';
import React from 'react';
import _ from 'lodash';
import canvasRequest from '../../../libs/canvas/action';
import { list_users_in_course_users } from '../../../libs/canvas/constants/courses'; // eslint-disable-line camelcase
import * as applicationActions from '../../actions/application';
import * as attendanceActions from '../../actions/attendance';
import * as errorActions from '../../actions/error';
import DateSelector from './date_selector';
import Student from './student';
import { ATTENDANCE_STATES as AttendanceStates } from '../../reducers/student';
import ExportModal from './export_modal';

const select = (state) => {
  const currentDate = state.application.date;

  return {
    students: _.orderBy(state.student.all, 'sortable_name'),
    settings: state.settings,
    applicationDate: currentDate,
    error: state.error,
    attendance: state.attendance.attendances[currentDate],
  };
};

export class StudentList extends React.Component {
  static propTypes = {
    error: React.PropTypes.shape({
      showError: React.PropTypes.bool,
      statusCode: React.PropTypes.number,
    }).isRequired,
    students: React.PropTypes.arrayOf(React.PropTypes.shape({})).isRequired,
    settings: React.PropTypes.shape({
      lmsCourseId: React.PropTypes.string,
      apiUrl: React.PropTypes.string,
    }).isRequired,
    applicationDate: React.PropTypes.string.isRequired,
    attendance: React.PropTypes.objectOf(React.PropTypes.string),
    canvasRequest: React.PropTypes.func.isRequired,
    getStudentAttendance: React.PropTypes.func.isRequired,
    markStudents: React.PropTypes.func.isRequired,
    showError: React.PropTypes.func.isRequired,
    downloadFile: React.PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      showExportModal: false,
    };
  }

  componentWillMount() {
    this.props.canvasRequest(list_users_in_course_users, { course_id: this.props.settings.lmsCourseId, enrollment_type: ['student'], include: ['avatar_url'] }, {});
    this.props.getStudentAttendance(this.props.applicationDate, this.props.settings.lmsCourseId);
  }

  updateStudentAttendance(student, status) {
    this.props.markStudents([{
      name: student.name,
      lms_student_id: student.lms_student_id,
      sortable_name: student.sortable_name,
    }],
      this.props.settings.lmsCourseId,
      this.props.applicationDate,
      status,
    );
  }

  handleDateChange(date) {
    this.props.getStudentAttendance(date, this.props.settings.lmsCourseId);
  }

  students() {
    const { attendance, students } = this.props;
    return _.map(students, (student) => {
      const id = student.lms_student_id;
      const props = {
        student,
        updateStudentAttendance:
          (updateStudent, status) => this.updateStudentAttendance(updateStudent, status),
        status: attendance ? attendance[id] : '',
      };
      return <Student key={`student${id}`} {...props} />;
    });
  }

  markAll(status) {
    const { students, settings, applicationDate } = this.props;
    this.props.markStudents(students, settings.lmsCourseId, applicationDate, status);
  }

  toggleExportModal() {
    this.setState({ showExportModal: !this.state.showExportModal });
  }

  errorModal() {
    const style = this.props.error.showError ? 'c-popup is-open' : 'c-popup';

    return (
      <div className={`${style}`}>
        <h3 className="c-popup__title">ERROR! {this.props.error.statusCode}</h3>
        <p className="c-popup__message">Something went wrong.</p>
        <button className="c-popup__btn" onClick={() => this.props.showError(false)}>Dismiss</button>
      </div>
    );
  }

  exportModal() {
    if (this.state.showExportModal) {
      return (
        <ExportModal
          apiUrl={this.props.settings.apiUrl}
          lmsCourseId={this.props.settings.lmsCourseId}
          downloadFile={this.props.downloadFile}
          onExport={() => this.toggleExportModal()}
          onOutsideClick={() => this.toggleExportModal()}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <div>
        <div className="c-top-bar">
          {this.errorModal()}
          <button className="c-btn c-btn--mark-all" onClick={() => this.markAll(AttendanceStates.PRESENT)}>Mark All Present</button>
          <button className="c-btn c-btn--unmark-all" onClick={() => this.markAll('')}>Unmark All</button>
          <button
            className="c-btn c-btn--unmark-all"
            onClick={() => this.toggleExportModal()}
          >
            Export
          </button>
          {this.exportModal()}
          <DateSelector
            date={this.props.applicationDate}
            updateDate={date => this.handleDateChange(date)}
          />
        </div>
        <table className="c-table">
          <thead />
          <tbody>
            {this.students()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(
  select,
  { canvasRequest, ...applicationActions, ...attendanceActions, ...errorActions },
)(StudentList);
