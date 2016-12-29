import React                   from 'react';
import { connect }             from 'react-redux';
import _                       from 'lodash';
import * as ProctorCodeActions from '../../actions/proctor_codes';
import Defines                 from '../../defines';
import ProctorCode             from './proctor_code';

const select = state => ({
  lmsUserId: state.settings.lmsUserId,
  proctorCodeList: state.proctorCodes.proctorCodeList,
});

export class BaseExamAssignmentList extends React.Component {
  static propTypes =  {
    loadProctorCodes: React.PropTypes.func.isRequired,
    lmsUserId: React.PropTypes.string.isRequired,
    proctorCodeList: React.PropTypes.shape({}).isRequired,
  }

  static tableHeader(styles) {
    return (
      <tr>
        <th style={styles.th}>STUDENT</th>
        <th style={styles.th}>EXAM</th>
        <th style={styles.th}>PROCTOR CODE</th>
        <th style={styles.th}>STATUS</th>
      </tr>
    );
  }

  static getStyles() {
    return {
      table: {
        borderCollapse: 'collapse',
        width: '100%',
      },
      tr: {
        backgroundColor: Defines.lightBackground,
        color: Defines.lightText,
      },
      th: {
        fontWeight: 'normal',
        textAlign: 'left',
        padding: '15px 20px',
        width: '25%',
      }
    };
  }

  componentWillMount() {
    this.props.loadProctorCodes(this.props.lmsUserId);
  }

  getProctorCodes() {
    // TODO: do sorting by search here probably
    return _.map(this.props.proctorCodeList, proctorCode => (
      <ProctorCode
        key={`proctor_${proctorCode.id}`}
        proctorCode={proctorCode}
        assignedExam={proctorCode.assigned_exam}
      />
    ));
  }
  render() {
    const styles = BaseExamAssignmentList.getStyles();
    return (
      <div>
        <table style={styles.table}>
          <thead  style={styles.tr}>
            {BaseExamAssignmentList.tableHeader(styles)}
          </thead>
          <tbody>
            {this.getProctorCodes()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(select, ProctorCodeActions)(BaseExamAssignmentList);
