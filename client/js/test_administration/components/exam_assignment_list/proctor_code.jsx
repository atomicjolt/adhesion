import React   from 'react';
import moment  from 'moment';
import _       from 'lodash';
import Defines from '../../defines';

export default class ProctorCode extends React.Component {
  static getStyles() {
    return {
      td: {
        textAlign: 'left',
        padding: '20px 20px',
        borderBottom: `1px solid ${Defines.lightGrey}`,
        color: Defines.darkGrey,
        verticalAlign: 'top'
      },
      bigAndBold: {
        fontWeight: 'bold',
        fontSize: '1.2em',
      },
      largeFont: {
        fontSize: '1.2em',
      },
    };
  }

  getStatus(){
    if (this.props.assignedExam.status){
      return _.capitalize(this.props.assignedExam.status);
    }
  }

  render() {
    const styles = ProctorCode.getStyles();
    const { assignedExam, proctorCode } = this.props;
    return (
      <tr>
        <td style={styles.td}>
          <div style={styles.bigAndBold}>{assignedExam.student_name}</div>
          <div>{assignedExam.student_id}</div>
        </td>
        <td style={styles.td}>
          <div style={styles.largeFont}>{assignedExam.exam_name}</div>
          <div>{assignedExam.course_name}</div>
          <div>{assignedExam.instructor_name}</div>
          <div>{moment(proctorCode.created_at).format('DD MMM YY H:m')}</div>
        </td>
        <td style={styles.td}>
          <div style={styles.largeFont}>
            {proctorCode.code}
          </div>
        </td>
        <td style={styles.td}>
          <div style={styles.bigAndBold}>{_.capitalize(this.props.assignedExam.status)}</div>
        </td>
      </tr>
    );
  }
}
