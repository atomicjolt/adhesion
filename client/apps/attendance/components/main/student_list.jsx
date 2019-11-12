import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import canvasRequest from 'atomic-canvas/libs/action';
import { listUsersInCourseUsers } from 'atomic-canvas/libs/constants/courses';
import { listCourseSections } from 'atomic-canvas/libs/constants/sections';
import Auth from 'atomic-canvas/libs/components/canvas_authentication';
import Sections from './sections';
import Student from './student';
import ExportModal from './export_modal';
import DateSelector from './date_selector';
import * as errorActions from '../../actions/error';
import * as attendanceActions from '../../actions/attendance';
import * as applicationActions from '../../actions/application';
import { ATTENDANCE_STATES as AttendanceStates } from '../../reducers/student';

const select = (state) => {
  const currentDate = state.application.date;
  return {
    students: _.orderBy(state.student.all, 'sortable_name'),
    settings: state.settings,
    applicationDate: currentDate,
    error: state.error,
    attendance: state.attendance.attendances[currentDate],
    sections: state.student.sections,
    canvasAuthRequired: state.settings.canvas_auth_required,
    isLargeDownload: state.attendance.isLargeDownload,
  };
};

export class StudentList extends React.Component {
  static propTypes = {
    error: PropTypes.shape({
      showError: PropTypes.bool,
      statusCode: PropTypes.number,
    }).isRequired,
    students: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    settings: PropTypes.shape({
      lms_course_id: PropTypes.string,
      api_url: PropTypes.string,
    }).isRequired,
    applicationDate: PropTypes.string.isRequired,
    attendance: PropTypes.objectOf(PropTypes.string),
    canvasRequest: PropTypes.func.isRequired,
    getStudentAttendance: PropTypes.func.isRequired,
    markStudents: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    sections: PropTypes.array,
  };

  constructor() {
    super();

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.state = {
      showExportModal: false,
      currentSection: -1,
    };
  }

  componentWillMount() {
    const params = {
      course_id: this.props.settings.lms_course_id,
      enrollment_type: ['student'],
      include: ['avatar_url', 'enrollments'],
      per_page: 50,
    };
    this.props.canvasRequest(
      listUsersInCourseUsers,
      params,
    );
    this.props.canvasRequest(
      listCourseSections,
      { course_id: this.props.settings.lms_course_id },
    );
    this.props.getStudentAttendance(
      this.props.applicationDate,
      this.props.settings.lms_course_id
    );
  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleKeyPress);
    this.mark_all.focus();
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyPress);
  }

  handleKeyPress(event) {
    if (event.keyCode === 27) {
      this.setState({ showExportModal: false });
    }
  }

  updateStudentAttendance(student, status) {
    this.props.markStudents([{
      name: student.name,
      lms_student_id: student.lms_student_id,
      sortable_name: student.sortable_name,
    }],
      this.props.settings.lms_course_id,
      this.props.applicationDate,
      status,
    );
  }

  handleDateChange(date) {
    this.props.getStudentAttendance(date, this.props.settings.lms_course_id);
  }

  studentInSection(student) {
    const enrollments = _.filter(student.enrollments, enrollment => (
      enrollment.course_section_id === this.state.currentSection
    ));
    if (enrollments.length > 0) return student;
    return null;
  }

  students() {
    const { attendance } = this.props;
    let { students } = this.props;

    if (this.state.currentSection !== -1) {
      students = _.filter(students, student =>
        this.studentInSection(student)
      );
    }

    return _.map(students, (student, index) => {
      const id = student.lms_student_id;
      const props = {
        student,
        updateStudentAttendance:
          (updateStudent, status) => this.updateStudentAttendance(updateStudent, status),
        status: attendance ? attendance[id] : '',
      };
      return (
        <Student
          key={`student${id}`}
          index={index}
          {...props}
        />
      );
    });
  }

  markAll(status) {
    const { students, settings, applicationDate } = this.props;
    const studentsData = _.map(
      students,
      student => (
        {
          name: student.name,
          lms_student_id: student.lms_student_id,
          sortable_name: student.sortable_name,
        }
      )
    );
    this.props.markStudents(studentsData, settings.lms_course_id, applicationDate, status);
  }

  toggleExportModal() {
    this.setState({ showExportModal: !this.state.showExportModal });
  }

  toggleSections() {
    this.setState({ showSections: !this.state.showSections });
  }

  closeReportModal() {
    this.props.toggleIsLargeDownload();
  }

  errorModal() {
    if (!this.props.error.showError) {
      return null;
    }
    return (
      <div className="c-popup is-open">
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
          lmsCourseId={this.props.settings.lms_course_id}
          downloadFile={this.props.downloadFile}
          closeModal={() => this.toggleExportModal()}
          closeReportModal={() => this.closeReportModal()}
          isLargeDownload={this.props.isLargeDownload}
        />
      );
    }
    return null;
  }

  filterStudents(section) {
    this.setState({ currentSection: section.value });
  }

  render() {
    if (this.props.canvasAuthRequired) {
      return <Auth autoSubmit hideButton />;
    }
    return (
      <div>
        <div className="c-top-bar">
          {this.errorModal()}
          <button
            className="c-btn c-btn--mark-all"
            onClick={() => this.markAll(AttendanceStates.PRESENT)}
            ref={(ref) => { this.mark_all = ref; }}
          >
            Mark All Present
          </button>
          <button
            className="c-btn c-btn--unmark-all"
            onClick={() => this.markAll('')}
          >
            Unmark All
          </button>
          <button
            className="c-btn c-btn--unmark-all qa-export-btn"
            onClick={() => this.toggleExportModal()}
          >
            Export
          </button>
          {this.exportModal()}
          <Sections
            filterStudents={section => this.filterStudents(section)}
            currentSection={this.state.currentSection}
            sections={this.props.sections}
          />
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
