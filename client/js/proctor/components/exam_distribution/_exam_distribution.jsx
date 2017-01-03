import React                       from 'react';
import { connect }                 from 'react-redux';
import _                           from 'lodash';
import Defines                     from '../../defines';
import canvasRequest               from '../../../libs/canvas/action';
import * as ExamActions            from '../../actions/exams';
import { listUsersInCourseUsers }  from '../../../libs/canvas/constants/courses';
import { getSubAccountsOfAccount } from '../../../libs/canvas/constants/accounts';
import StudentAssign               from './student_assign';
import appHistory                  from '../../../history';
import HoverButton                 from '../common/hover_button';
import DownLoadSvg                 from '../common/download_svg';

const select = (state, props) => {
  const exam = _.find(state.exams.examList, ex => props.params.id === ex.id.toString());
  return {
    lmsCourseId: state.settings.lmsCourseId,
    lmsUserId: state.settings.lmsUserId,
    lmsCourseName: state.settings.lmsCourseName,
    exam,
    instructorName: state.settings.displayName,
    studentList: state.students.studentList,
    testingCentersAccountId: state.settings.testingCentersAccountId,
    testingCenterList: state.testingCenters.testingCenterList,
    assignedExams: state.exams.assignedExams,
    ready: state.exams.ready,
  };
};

export class BaseExamDistribution extends React.Component {

  static propTypes = {
    canvasRequest: React.PropTypes.func.isRequired,
    lmsCourseId: React.PropTypes.string.isRequired,
    lmsUserId: React.PropTypes.string.isRequired,
    lmsCourseName: React.PropTypes.string.isRequired,
    exam: React.PropTypes.shape({ title: React.PropTypes.string }),
    studentList: React.PropTypes.shape({}),
    testingCenterList: React.PropTypes.shape({}),
    params: React.PropTypes.shape({ id: React.PropTypes.string.isRequired }),
    assignExam: React.PropTypes.func.isRequired,
    reassignExam: React.PropTypes.func.isRequired,
    loadAssignedExams: React.PropTypes.func.isRequired,
    downloadExamStatus: React.PropTypes.func.isRequired,
    testingCentersAccountId: React.PropTypes.number.isRequired,
    assignedExams: React.PropTypes.shape({}),
    instructorName: React.PropTypes.string.isRequired,
    ready: React.PropTypes.bool.isRequired
  }

  static getStyles() {
    return {
      table: {
        borderCollapse: 'collapse',
        width: '100%',
      },
      header: {
        color: Defines.darkGrey,
      },
      tr: {
        backgroundColor: Defines.lightBackground,
        color: Defines.lightText,
      },
      th: {
        fontWeight: 'normal',
        textAlign: 'left',
        padding: '15px 20px',
      },
      smaller: {
        width: '15%',
      },
      larger: {
        width: '35%',
      },
      button: {
        content: '\u25BE'
      },
      ad: {
        cursor: 'pointer',
        border: 'none',
        backgroundColor: 'inherit',
        fontWeight: 'normal',
        color: Defines.lightText,
        fontSize: 'inherit',
      },
      regular: {
        width: '20%',
      },
      floatRight: {
        float: 'right',
        padding: '8px 20px',
        borderRadius: '0',
        backgroundColor: Defines.lightBackground,
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer'
      },
      downloadSvg: {
        float: 'right',
        marginLeft: '15px',
        backgroundColor: Defines.lightBackground,
        border: 'none',
        cursor: 'pointer'
      },
    };
  }

  constructor() {
    super();
    this.state = {
      sortBy: 'status',
    };
  }

  componentWillMount() {
    this.getStudents();
    this.getTestingCenters();
    this.props.loadAssignedExams(this.props.params.id);
  }

  getTestingCenters() {
    const params = {
      account_id: this.props.testingCentersAccountId,
    };
    this.props.canvasRequest(getSubAccountsOfAccount, params, {});
  }

  getStudents() {
    const params = {
      course_id: this.props.lmsCourseId,
      enrollment_type: ['student']
    };
    this.props.canvasRequest(listUsersInCourseUsers, params, {});
  }

  tableHeader(styles) {
    return (
      <tr>
        <th style={{ ...styles.th, ...styles.regular }}>
          <button className="spec_name" style={styles.ad} onClick={() => this.setState({ sortBy: 'name' })}>
            STUDENTS &#8595;
          </button>
        </th>
        <th style={{ ...styles.th, ...styles.larger }}>TESTING CENTER</th>
        <th style={{ ...styles.th, ...styles.smaller }}>ASSIGNED</th>
        <th style={{ ...styles.th, ...styles.smaller }}>USED</th>
        <th style={{ ...styles.th, ...styles.smaller }}>
          <button style={styles.ad} onClick={() => this.setState({ sortBy: 'status' })}>
            STATUS &#8595;
          </button>
        </th>
      </tr>
    );
  }

  assignExam(student, centerId, centerName) {
    const body = {
      exam_id: this.props.params.id,
      testing_center_name: centerName,
      course_id: this.props.lmsCourseId,
      student_id: student.id,
      student_name: student.name,
      instructor_id: this.props.lmsUserId,
      testing_center_id: centerId,
      instructor_name: this.props.instructorName,
      exam_name: this.props.exam.title,
      course_name: this.props.lmsCourseName,
    };
    this.props.assignExam(body);
  }

  reassignExam(assignedExamId, centerId, centerName) {
    const body = {
      testing_center_id: centerId,
      testing_center_name: centerName
    };
    this.props.reassignExam(assignedExamId, body);
  }

  buildStudentAssign(student) {
    return (
      <StudentAssign
        key={`student_${student.id}`}
        student={student}
        testingCenterList={this.props.testingCenterList}
        assignExam={(studentId, centerId, name) => this.assignExam(studentId, centerId, name)}
        reassignExam={(assignedId, centerId, name) => this.reassignExam(assignedId, centerId, name)}
        assignedExam={this.props.assignedExams[student.id]}
      />
    );
  }

  studentExamList() {
    if (!this.props.ready) { return []; }

    if (this.state.sortBy === 'status') {
      const list = [];
      _.each(this.props.studentList, (student) => {
        if (this.props.assignedExams[student.id]) {
          list.push(this.buildStudentAssign(student));
        } else {
          list.unshift(this.buildStudentAssign(student));
        }
      });
      return list;
    }

    const students = _.sortBy(this.props.studentList, student => student.name);
    return _.map(students, student => (this.buildStudentAssign(student)));
  }

  render() {
    const styles = BaseExamDistribution.getStyles();
    const { params, lmsCourseId } = this.props;
    return (
      <div>
        <h1 style={styles.header}>
          {this.props.exam.title}
          <HoverButton
            className="spec_download"
            style={styles.downloadSvg}
            onClick={() => this.props.downloadExamStatus(params.id, lmsCourseId)}
          >
            <DownLoadSvg />
          </HoverButton>
          <HoverButton className="spec_back" style={styles.floatRight} onClick={() => appHistory.push('/')}>
            &#10226;
          </HoverButton>
        </h1>
        <table style={styles.table}>
          <thead  style={styles.tr}>
            {this.tableHeader(styles)}
          </thead>
          <tbody>
            {this.studentExamList()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(select, { canvasRequest, ...ExamActions })(BaseExamDistribution);
