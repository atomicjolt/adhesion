import React                         from 'react';
import { connect }                   from 'react-redux';
import _                             from 'lodash';
import appHistory                    from '../../../history';
import Defines                       from '../../defines';
import canvasRequest                 from '../../../libs/canvas/action';
import * as ExamActions              from '../../actions/exams';
import { listQuizzesInCourse }       from '../../../libs/canvas/constants/quizzes';
import ExamListItem                  from './exam_list_item';
import { getTestingCentersAccount }  from '../../actions/testing_centers_account';

const select = state => ({
  examList: state.exams.examList,
  lmsCourseId: state.settings.lmsCourseId,
  toolConsumerInstanceName: state.settings.toolConsumerInstanceName,
  lmsUserId: state.settings.lmsUserId,
  examRequests: state.exams.examRequests,
});

export class BaseExamList extends React.Component {

  static propTypes = {
    canvasRequest: React.PropTypes.func.isRequired,
    getTestingCentersAccount: React.PropTypes.func.isRequired,
    loadExamRequests: React.PropTypes.func.isRequired,
    lmsCourseId: React.PropTypes.string.isRequired,
    examList: React.PropTypes.shape({}),
    toolConsumerInstanceName: React.PropTypes.string.isRequired,
    lmsUserId: React.PropTypes.number.isRequired,
    examRequests: React.PropTypes.shape({}),
  }

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
          STATUS
        </th>
      </tr>
    );
  }

  static getStyles() {
    return {
      header: {
        color: Defines.darkGrey,
        padding: '10px 20px',
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
        width: '75%',
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

  examListItems() {
    return _.map(this.props.examList, exam => (
      <ExamListItem
        key={`exam_${exam.id}`}
        exam={exam}
        goToExam={id => BaseExamList.goToExam(id)}
        examRequest={this.props.examRequests[exam.id]}
      />
    ));
  }

  render() {
    const styles = BaseExamList.getStyles();
    return (
      <div>
        <h1 style={styles.header}>Request an Exam</h1>
        <hr style={styles.hr} />
        <table style={styles.table}>
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
