import React                   from 'react';
import { connect }             from 'react-redux';
import Defines                 from '../defines';
import canvasRequest           from '../../libs/canvas/action';
import { listQuizzesInCourse } from '../../libs/canvas/constants/quizzes';

const select = state => ({
  lmsCourseId: state.settings.lmsCourseId
});

export class ExamList extends React.Component {

  static propTypes = {
    canvasRequest: React.PropTypes.func.isRequired,
    lmsCourseId: React.PropTypes.oneOfType([React.PropTypes.string,
    React.PropTypes.number]).isRequired,
  }

  static getStyles() {
    return {
      header: {
        color: Defines.darkGrey,
        padding: '10px 20px'
      },
      hr: {
        borderTop: `2px solid ${Defines.lightGrey}`,
      },
    };
  }

  componentWillMount() {
    const params = {
      course_id: this.props.lmsCourseId
    };
    this.props.canvasRequest(listQuizzesInCourse, params);
  }

  examListItems(){
    return <div></div>;
  }

  render() {
    const styles = ExamList.getStyles();
    return (
      <div>
        <h2 style={styles.header}>Choose an Exam to release</h2>
        <hr style={styles.hr} />
      </div>
    );
  }
}

export default connect(select, { canvasRequest })(ExamList);
