import React                   from 'react';
import { connect }             from 'react-redux';
import { hashHistory }         from 'react-router';
import _                       from 'lodash';
import Defines                 from '../../defines';
import canvasRequest           from '../../../libs/canvas/action';
import { listUsersInCourseUsers } from '../../../libs/canvas/constants/courses';
import StudentAssign           from  './student_assign'

const select = (state, props) => {
  const exam = _.find(state.exams.examList, (exam)=>(props.params.id == exam.id));
  return {
    lmsCourseId: state.settings.lmsCourseId,
    exam,
    studentList: state.students.studentList,
    centers: [{id: 111, name: "center 1"},
              {id: 222, name: "center 2"},
              {id: 333, name: "center 3"}
              ]
  };
}

export class BaseExamDistribution extends React.Component {

  static propTypes = {
    canvasRequest: React.PropTypes.func.isRequired,
    lmsCourseId: React.PropTypes.string.isRequired,
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
      }
    };
  }

  componentWillMount() {
    this.getStudents();
  }

  getStudents(){
    const params = {
      course_id: this.props.lmsCourseId,
      enrollment_type: ['student']
    };
    this.props.canvasRequest(listUsersInCourseUsers, params, {});
  }

  tableHeader(styles){
    return (
      <tr>
        <th style={styles.th}>STUDENTS</th>
        <th style={{...styles.th, ...styles.larger}}>TESTING CENTER</th>
        <th style={{...styles.th, ...styles.smaller}}>ASSIGNED</th>
        <th style={{...styles.th, ...styles.smaller}}>USED</th>
        <th style={{...styles.th, ...styles.smaller}}>STATUS</th>
      </tr>
    )
  }

studentList(){
  return _.map()
}


  render() {
    const styles = BaseExamDistribution.getStyles();
    console.log(this.props.studentList);
    return (
      <div>
        <h1 style={styles.header}>{this.props.exam.title}</h1>
        <table style={styles.table}>
          <thead  style={styles.tr}>
            {this.tableHeader(styles)}
          </thead>
          <tbody>
            {
              _.map(this.props.studentList, student => (
                <StudentAssign
                  key={`student_${student.id}`}
                  student={student}
                  centers={this.props.centers}
                />
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(select, { canvasRequest })(BaseExamDistribution);
