import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import canvasRequest from 'atomic-canvas/libs/action';
import { listQuizzesInCourse } from 'atomic-canvas/libs/constants/quizzes';
import appHistory from '../../history';
import Defines from '../../defines';
import * as ExamActions from '../../actions/exams';
import ExamListItem from './exam_list_item';
import { getTestingCentersAccount } from '../../actions/testing_centers_account';

const select = state => ({
  examList: state.exams.examList,
  lmsCourseId: state.settings.lms_course_id,
  toolConsumerInstanceName: state.settings.tool_consumer_instance_name,
  lmsUserId: state.settings.lms_user_id,
  examRequests: state.exams.examRequests,
});

export class BaseExamList extends React.Component {

  static propTypes = {
    canvasRequest: PropTypes.func.isRequired,
    getTestingCentersAccount: PropTypes.func.isRequired,
    loadExamRequests: PropTypes.func.isRequired,
    lmsCourseId: PropTypes.string.isRequired,
    examList: PropTypes.arrayOf(PropTypes.shape({})),
    toolConsumerInstanceName: PropTypes.string.isRequired,
    lmsUserId: PropTypes.string.isRequired,
    examRequests: PropTypes.shape({}),
  };

  static goToExam(id) {
    appHistory.push(`exams/${id}`);
  }

  static tableHeader(styles) {
    return (
      <tr>
        <th style={{ ...styles.th, ...styles.larger }}>
          EXAM
        </th>
        <th style={{ ...styles.th, ...styles.smaller }}>
          TESTING CENTER
        </th>
        <th style={{ ...styles.th, ...styles.smaller }}>
          STATUS
        </th>
      </tr>
    );
  }

  static getStyles() {
    return {
      header: {
        color: Defines.darkGrey,
        padding: '10px 20px 0px 20px',
      },
      message: {
        padding: '0px 20px',
        marginBottom: '20px',
      },
      hr: {
        borderTop: `2px solid ${Defines.lightGrey}`,
        margin: '0px',
      },
      table: {
        borderCollapse: 'collapse',
        width: '100%',
      },
      thead: {
        backgroundColor: Defines.lightBackground,
        color: Defines.lightText,
      },
      th: {
        fontWeight: 'normal',
        textAlign: 'left',
        padding: '15px 20px',
      },
      smaller: {
        width: '25%',
      },
      larger: {
        width: '50%',
      },
    };
  }

  componentWillMount() {
    const params = {
      course_id: this.props.lmsCourseId,
    };
    this.props.getTestingCentersAccount(this.props.toolConsumerInstanceName);
    this.props.canvasRequest(listQuizzesInCourse, params);
    this.props.loadExamRequests(this.props.lmsUserId);
  }

  filteredExams() {
    let exams = _.filter(this.props.examList, exam => (
      !this.props.examRequests[exam.id] ||
      (this.props.examRequests[exam.id] && this.props.examRequests[exam.id].status !== 'finished')
    ));
    exams = _.filter(exams, exam => _.includes(exam.access_code, 'proctored-exam'));
    exams = _.orderBy(exams, exam => moment(exam.due_at).toDate(), ['asc']);
    return exams;
  }

  examListItems() {
    return _.map(this.filteredExams(), exam => (
      <ExamListItem
        key={`exam_${exam.id}`}
        exam={exam}
        goToExam={id => BaseExamList.goToExam(id)}
        examRequest={this.props.examRequests[exam.id]}
      />
    ));
  }

  render() {
    if (!this.props.examRequests) { return null; }
    const styles = BaseExamList.getStyles();
    return (
      <div>
        <h1 style={styles.header}>Request an Exam</h1>
        <div style={styles.message}>
          If you need to change where you take an exam, create a new request.
        </div>
        <hr style={styles.hr} />
        <table className="qa-exam-list-table" style={styles.table}>
          <thead style={styles.thead}>
            {BaseExamList.tableHeader(styles)}
          </thead>
          <tbody>
            {this.examListItems()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(
  select,
  { canvasRequest, getTestingCentersAccount, ...ExamActions }
)(BaseExamList);
