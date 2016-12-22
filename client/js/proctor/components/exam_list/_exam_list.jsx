import React                   from 'react';
import { connect }             from 'react-redux';
import { hashHistory }         from 'react-router';
import _                       from 'lodash';
import Defines                 from '../../defines';
import canvasRequest           from '../../../libs/canvas/action';
import { listQuizzesInCourse } from '../../../libs/canvas/constants/quizzes';
import ExamListItem            from './exam_list_item';

const select = state => ({
  examList: state.exams.examList,
  lmsCourseId: state.settings.lmsCourseId,
});

export class BaseExamList extends React.Component {

  static propTypes = {
    canvasRequest: React.PropTypes.func.isRequired,
    lmsCourseId: React.PropTypes.string.isRequired,
    examList: React.PropTypes.arrayOf(React.PropTypes.shape({})),
  }

  static goToExam() {
    hashHistory.push('');
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
      ul: {
        listStyle: 'none',
        padding: '0px',
        margin: '0px',
      }
    };
  }

  componentWillMount() {
    const params = {
      course_id: this.props.lmsCourseId
    };
    this.props.canvasRequest(listQuizzesInCourse, params);
  }


  examListItems() {
    return _.map(this.props.examList, exam => (
      <ExamListItem
        key={`exam_${exam.id}`}
        exam={exam}
        goToExam={id => BaseExamList.goToExam(id)}
      />
    ));
  }

  render() {
    const styles = BaseExamList.getStyles();
    return (
      <div>
        <h1 style={styles.header}>Choose an Exam to release</h1>
        <hr style={styles.hr} />
        <ul style={styles.ul}>
          {this.examListItems()}
        </ul>
      </div>
    );
  }
}

export default connect(select, { canvasRequest })(BaseExamList);
