import React                                     from 'react';
import { connect }                               from 'react-redux';
import _                                         from 'lodash';
import Sections                                  from './sections';
import Student                                   from './student';
import ExportModal                               from './export_modal';
import DateSelector                              from './date_selector';
import * as errorActions                         from '../../actions/error';
import * as attendanceActions                    from '../../actions/attendance';
import * as applicationActions                   from '../../actions/application';
import canvasRequest                             from '../../../libs/canvas/action';
import { listUsersInCourseUsers }
                               from '../../../libs/canvas/constants/courses';
import { listCourseSections }
                               from '../../../libs/canvas/constants/sections';
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
      lms_course_id: React.PropTypes.string,
      api_url: React.PropTypes.string,
    }).isRequired,
    applicationDate: React.PropTypes.string.isRequired,
    attendance: React.PropTypes.objectOf(React.PropTypes.string),
    canvasRequest: React.PropTypes.func.isRequired,
    getStudentAttendance: React.PropTypes.func.isRequired,
    markStudents: React.PropTypes.func.isRequired,
    showError: React.PropTypes.func.isRequired,
    downloadFile: React.PropTypes.func.isRequired,
    sections: React.PropTypes.array,
  };

  constructor() {
    super();

    this.handleKeyPress = ::this.handleKeyPress;
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
    const enrollments = _.filter(student.enrollments, (enrollment) => {
      if (enrollment.course_section_id === this.state.currentSection) {
        return enrollment;
      }
      return null;
    });
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
    this.props.markStudents(students, settings.lms_course_id, applicationDate, status);
  }

  toggleExportModal() {
    this.setState({ showExportModal: !this.state.showExportModal });
  }

  toggleSections() {
    this.setState({ showSections: !this.state.showSections });
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
          apiUrl={this.props.settings.api_url}
          lmsCourseId={this.props.settings.lms_course_id}
          downloadFile={this.props.downloadFile}
          onExport={() => this.toggleExportModal()}
          onOutsideClick={() => this.toggleExportModal()}
        />
      );
    }
    return null;
  }

  filterStudents(section) {
    this.setState({ currentSection: section.value });
  }

  render() {
    return (
      <div>
        <div className="c-top-bar">
          {this.errorModal()}
          <button
            className="c-btn c-btn--mark-all"
            onClick={() => this.markAll(AttendanceStates.PRESENT)}
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
            className="c-btn c-btn--unmark-all"
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
