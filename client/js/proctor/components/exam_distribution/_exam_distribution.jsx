import React                       from 'react';
import { connect }                 from 'react-redux';
import _                           from 'lodash';
import Defines                     from '../../defines';
import canvasRequest               from '../../../libs/canvas/action';
import * as ExamActions            from '../../actions/exams';
import { listUsersInCourseUsers }  from '../../../libs/canvas/constants/courses';
import { getSubAccountsOfAccount } from '../../../libs/canvas/constants/accounts';
import StudentAssign               from './student_assign';
import HoverButton                 from '../common/hover_button';

const select = (state, props) => {
  const exam = _.find(state.exams.examList, ex => props.params.id === ex.id.toString());
  return {
    lmsCourseId: state.settings.lmsCourseId,
    lmsUserId: state.settings.lmsUserId,
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
    exam: React.PropTypes.shape({ title: React.PropTypes.string }),
    studentList: React.PropTypes.shape({}),
    testingCenterList: React.PropTypes.shape({}),
    params: React.PropTypes.shape({ id: React.PropTypes.string.isRequired }),
    assignExam: React.PropTypes.func.isRequired,
    reassignExam: React.PropTypes.func.isRequired,
    loadAssignedExams: React.PropTypes.func.isRequired,
    testingCentersAccountId: React.PropTypes.number.isRequired,
    assignedExams: React.PropTypes.shape({}),
    instructorName: React.PropTypes.string.isRequired,
    ready: React.PropTypes.bool.isRequired
  }

  static tableHeader(styles) {
    return (
      <tr>
        <th style={styles.th}>
          STUDENTS
        </th>
        <th style={{ ...styles.th, ...styles.larger }}>TESTING CENTER</th>
        <th style={{ ...styles.th, ...styles.smaller }}>ASSIGNED</th>
        <th style={{ ...styles.th, ...styles.smaller }}>USED</th>
        <th style={{ ...styles.th, ...styles.smaller }}>STATUS</th>
      </tr>
    );
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
      }
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

  assignExam(studentId, centerId) {
    const body = {
      exam_id: this.props.params.id,
      course_id: this.props.lmsCourseId,
      student_id: studentId,
      instructor_id: this.props.lmsUserId,
      testing_center_id: centerId,
      instructor_name: this.props.instructorName,
    };
    this.props.assignExam(body);
  }

  reassignExam(assignedExamId, centerId) {
    const body = {
      testing_center_id: centerId
    };
    this.props.reassignExam(assignedExamId, body);
  }

  studentExamList() {
    if (!this.props.ready) { return []; }

    if (this.state.sortBy === 'status') {
      const list = [];
      _.each(this.props.studentList, (student) => {
        if (this.props.assignedExams[student.id]) {
          list.push(
            <StudentAssign
              key={`student_${student.id}`}
              student={student}
              testingCenterList={this.props.testingCenterList}
              assignExam={(studentId, centerId) => this.assignExam(studentId, centerId)}
              reassignExam={(assignedId, centerId) => this.reassignExam(assignedId, centerId)}
              assignedExam={this.props.assignedExams[student.id]}
            />
          );
        } else {
          list.unshift(
            <StudentAssign
              key={`student_${student.id}`}
              student={student}
              testingCenterList={this.props.testingCenterList}
              assignExam={(studentId, centerId) => this.assignExam(studentId, centerId)}
              reassignExam={(assignedId, centerId) => this.reassignExam(assignedId, centerId)}
              assignedExam={this.props.assignedExams[student.id]}
            />
          );
        }
      });
      return list;
    }

    const students = _.sortBy(this.props.studentList, student => student.name);
    return _.map(students, student => (
      <StudentAssign
        key={`student_${student.id}`}
        student={student}
        testingCenterList={this.props.testingCenterList}
        assignExam={(studentId, centerId) => this.assignExam(studentId, centerId)}
        reassignExam={(assignedId, centerId) => this.reassignExam(assignedId, centerId)}
        assignedExam={this.props.assignedExams[student.id]}
      />
    ));
  }

  render() {
    const styles = BaseExamDistribution.getStyles();
    return (
      <div>
        <h1 style={styles.header}>{this.props.exam.title}</h1>
        <table style={styles.table}>
          <thead  style={styles.tr}>
            {BaseExamDistribution.tableHeader(styles)}
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
