import React                   from 'react';
import { connect }             from 'react-redux';
import _                       from 'lodash';
import Fuse                    from 'fuse.js';
import * as ProctorCodeActions from '../../actions/proctor_codes';
import * as ModalActions       from '../../../actions/modal';
import Defines                 from '../../defines';
import ProctorCode             from './proctor_code';
import SearchBar               from './search_bar';
import canvasRequest           from '../../../libs/canvas/action';
import { createConversation }  from '../../../libs/canvas/constants/conversations';

const select = state => ({
  lmsUserId: state.settings.lmsUserId,
  currentAccountId: state.settings.customCanvasAccountID,
  toolConsumerInstanceName: state.settings.toolConsumerInstanceName,
  proctorCodeList: state.proctorCodes.proctorCodeList,
});

export class BaseExamAssignmentList extends React.Component {
  static propTypes =  {
    loadProctorCodes: React.PropTypes.func.isRequired,
    testingCentersAccountSetup: React.PropTypes.func.isRequired,
    toolConsumerInstanceName: React.PropTypes.func.isRequired,
    lmsUserId: React.PropTypes.string.isRequired,
    currentAccountId: React.PropTypes.string.isRequired,
    proctorCodeList: React.PropTypes.arrayOf(
      React.PropTypes.shape({})
    ).isRequired,
    hideModal: React.PropTypes.func.isRequired,
    showModal: React.PropTypes.func.isRequired,
    canvasRequest: React.PropTypes.func.isRequired,
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
        width: '100%',
      },
      th: {
        fontWeight: 'normal',
        textAlign: 'left',
        padding: '15px 20px',
        width: '25%',
      }
    };
  }
  constructor() {
    super();
    this.state = {
      searchVal: null
    };
  }

  componentWillMount() {
    this.props.loadProctorCodes(this.props.lmsUserId);
    this.props.testingCentersAccountSetup(
      this.props.currentAccountId,
      this.props.toolConsumerInstanceName
    );
  }


  getProctorCodes() {
    const options = {
      shouldSort: false,
      threshold: 0.5,
      keys: [
        'assigned_exam.student_name',
        'assigned_exam.instructor_name',
        'assigned_exam.course_name',
        'assigned_exam.exam_name',
        'assigned_exam.status',
      ]
    };
    // it might be useful also to search the student id but fuse doesnt search numbers
    // so we would need to add a value to the each item in the list when it comes
    // back from the database called like sortable id that is just the string of the
    // student id. If we decide we want that then we can do it.
    let renderList = this.props.proctorCodeList;
    if (this.state.searchVal && this.state.searchVal !== '') {
      const fuse = new Fuse(this.props.proctorCodeList, options);
      renderList = fuse.search(this.state.searchVal);
    }

    return _.map(renderList, proctorCode => (
      <ProctorCode
        key={`proctor_${proctorCode.id}`}
        proctorCode={proctorCode}
        assignedExam={proctorCode.assigned_exam}
        sendMessage={(id, body, subject) => this.sendMessage(id, body, subject)}
        showModal={this.props.showModal}
        hideModal={this.props.hideModal}
      />
    ));
  }

  sendMessage(id, body, subject) {
    const payload = {
      recipients: [_.toString(id)],
      subject,
      body,
    };
    this.props.canvasRequest(createConversation, {}, payload);
  }

  render() {
    const styles = BaseExamAssignmentList.getStyles();
    return (
      <div>
        <SearchBar searchChange={e => this.setState({ searchVal: e.target.value })} />
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

export default connect(select, {
  ...ProctorCodeActions,
  ...ModalActions,
  canvasRequest,
})(BaseExamAssignmentList);
