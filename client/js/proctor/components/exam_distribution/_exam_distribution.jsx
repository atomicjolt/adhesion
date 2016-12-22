import React                   from 'react';
import { connect }             from 'react-redux';
import { hashHistory }         from 'react-router';
import _                       from 'lodash';
import Defines                 from '../../defines';
import canvasRequest           from '../../../libs/canvas/action';
import { listQuizzesInCourse } from '../../../libs/canvas/constants/quizzes';

const select = state => ({
  lmsCourseId: state.settings.lmsCourseId,
  exam: state.exams.examList[1321],
});

export class BaseExamDistribution extends React.Component {

  static propTypes = {
    canvasRequest: React.PropTypes.func.isRequired,
    lmsCourseId: React.PropTypes.string.isRequired,
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

  // componentWillMount() {
  //   const params = {
  //     course_id: this.props.lmsCourseId
  //   };
  //   this.props.canvasRequest(listQuizzesInCourse, params);
  // }

  getStudents(){
    params = {
      course_id: this.props.lmsCourseId,
      enrollment_type: ['student']
    };
    this.props.canvasRequest(listUsersInCourseUsers, params);
  }


  render() {
    const styles = BaseExamDistribution.getStyles();
    return (
      <div>
        <h1 style={styles.header}>This is test page</h1>
      </div>
    );
  }
}

export default connect(select, { canvasRequest })(BaseExamDistribution);
ddddddfsdfsss